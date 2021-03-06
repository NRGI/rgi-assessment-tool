'use strict';
/* global require */

var User                = require('mongoose').model('User'),
    ResetPasswordToken  = require('mongoose').model('ResetPasswordToken'),
    generalResponse     = require('../utilities/general-response'),
    encrypt             = require('../utilities/encryption'),
    contact             = require('../utilities/contact');

exports.getUsers = function (req, res) {
    var query = User.find(req.query);

    if (!req.user.hasRole('supervisor')) {
        query = query.select({firstName: 1, lastName: 1});
    }

    query.exec(function (err, collection) {
        res.send(err ? {reason: err.toString()} : collection);
    });
};

exports.getUserByID = function (req, res) {
    User.findOne({_id: req.params.id}).exec(function (err, user) {
        res.send(err ? {reason: err.toString()} : user);
    });
};

exports.createUser = function (req, res) {
    var user_data = req.body;
    user_data.password = new Date().toISOString();

    var contact_packet = {
        send_name: req.user.firstName + " " + req.user.lastName,
        send_email: req.user.email
    };

    if (user_data.firstName && user_data.lastName) {
        contact_packet.rec_name = user_data.firstName.charAt(0).toUpperCase() + user_data.firstName.slice(1) + " " + user_data.lastName.charAt(0).toUpperCase() + user_data.lastName.slice(1);
    }

    if (user_data.username) {
        user_data.username = user_data.username.toLowerCase();
        contact_packet.rec_username = user_data.username;
    }

    if (user_data.email) {
        contact_packet.rec_email = user_data.email;
    }

    if (user_data.role) {
        contact_packet.rec_role = user_data.role.charAt(0).toUpperCase() + user_data.role.slice(1);
    }

    user_data.salt = encrypt.createSalt();
    user_data.hashed_pwd = encrypt.hashPwd(user_data.salt, user_data.password);
    user_data.createdBy = req.user._id;

    User.create(user_data, function (err, user) {
        if (err) {
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Username');
            }

            return generalResponse.respondError(res, err);
        }

        ResetPasswordToken.createByUser(user._id, function(err, tokenData) {
            if(!err) {
                contact.new_user_confirmation(contact_packet, tokenData._id);
            }
        });

        res.send();
    });
};

exports.updateUser = function (req, res) {
    var user_update = req.body;

    if (req.user._id != user_update._id && !req.user.hasRole('supervisor')) {
        return generalResponse.respondStatus(res, 403);
    }

    User.findOne({_id: req.body._id}).exec(function (findUserError, user) {
        var updateUser = function() {
            [
                'firstName',
                'lastName',
                'disabled',
                'email',
                'role',
                'address',
                'language',
                'assessments',
                'documents',
                'interviewees',
                'showAllAssessments'
            ]
                .forEach(function(field) {
                    user[field] = user_update[field];
                });

            user.save(function (saveError) {
                res.send(saveError ? {reason: saveError.toString()} : user);
            });
        };

        if (findUserError) {
            generalResponse.respondError(res, findUserError);
        } else if(user === null) {
            generalResponse.respondError(res, 'User not found', 404);
        } else {
            if (user_update.password && user_update.password.length > 0) {
                user.setPassword(user_update.password, function (setPasswordError) {
                    if (setPasswordError) {
                        res.send({reason: setPasswordError.toString()});
                    } else {
                        updateUser();
                    }
                });
            } else {
                updateUser();
            }
        }
    });
};

//TODO send deleted user information to 'purgatory for a period in case admin needs to undo
//TODO remove associated data
exports.deleteUser = function (req, res) {
    User.remove({_id: req.params.id}, function (err) {
        res.send(err ? {reason: err.toString()} : undefined);
    });
};
