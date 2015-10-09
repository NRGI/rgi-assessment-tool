'use strict';
/* global require */

var User                = require('mongoose').model('User'),
    ResetPasswordToken  = require('mongoose').model('ResetPasswordToken'),
    encrypt             = require('../utilities/encryption'),
    contact             = require('../utilities/contact');
    // client = require('campaign')();
    // client.send(template, options, done);

exports.getUsers = function (req, res) {
    var query;
    if (req.user.hasRole('supervisor')) {
        query = User.find(req.query);
    } else {
        query = User.find(req.query).select({ "firstName": 1, "lastName": 1});
    }
    query.exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getUsersByID = function (req, res) {
    User.findOne({_id: req.params.id}).exec(function (err, user) {
        res.send(user);
    });
};

exports.getUsersListByID = function (req, res) {
    var query = User.findOne({_id: req.params.id}).select({ "firstName": 1, "lastName": 1, "email": 1, "role": 1});
    query.exec(function (err, user) {
        res.send(user);
    });
};

exports.createUser = function (req, res) {
    var userData = req.body,
        contact_packet = {};
    userData.password = new Date().toISOString();

    contact_packet.rec_email = userData.email;
    try {
        contact_packet.rec_name = userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1) + " " + userData.lastName.charAt(0).toUpperCase() + userData.lastName.slice(1);
    }
    catch(err) {
        res.status(400);
        return res.send({reason: 'first and last name is required'});
    }
    try {
        userData.username = userData.username.toLowerCase();
    }
    catch(err) {
        res.status(400);
        return res.send({reason: 'username is required'});
    }
    try {
        contact_packet.rec_role = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
    }
    catch(err) {
        res.status(400);
        return res.send({reason: 'user role is required'});
    }
    contact_packet.rec_username = userData.username;
    contact_packet.rec_password = userData.password;
    contact_packet.send_name = req.user.firstName + " " + req.user.lastName;
    contact_packet.send_email = req.user.email;


    userData.salt = encrypt.createSalt();
    userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
    userData.createdBy = req.user._id;
    console.log(userData);

    User.create(userData, function (err, user, next) {
        if (err) {
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Username');
            }
            //console.log(err);
            res.status(400);
            return res.send({reason: err.toString()});
        }

        ResetPasswordToken.createByUser(user._id, function(err, tokenData) {
            contact.new_user_confirmation(contact_packet, tokenData._id);
        });

        res.send();
        next();
    });
};
//TODO update user email
exports.updateUser = function (req, res) {
    var userUpdates = req.body;

    if (req.user._id != userUpdates._id && !req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }


    User.findOne({_id: req.body._id}).exec(function (err, user) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        if (userUpdates.password && userUpdates.password.length > 0) {
            user.setPassword(userUpdates.password, function (err) {
                if (err) {
                    return res.send({ reason: err.toString() });
                }
            });
        }
        user.firstName = userUpdates.firstName;
        user.lastName = userUpdates.lastName;
        user.email = userUpdates.email;
        user.language = userUpdates.language;
        user.assessments = userUpdates.assessments;
        user.documents = userUpdates.documents;
        user.interviewees = userUpdates.interviewees;
        if (user.modified) {
            user.modified.push({modifiedBy: req.user._id});
        } else {
            user.modified = {modifiedBy: req.user._id};
        }
        user.save(function (err) {
            if (err) {
                return res.send({ reason: err.toString() });
            }
        });
    });
    res.send();
};

//TODO send deleted user information to 'purgatory for a period in case admin needs to undo
//TODO remove associated data
exports.deleteUser = function (req, res) {
    //var user_delete = req.body,
    //    contact_packet = {};
    //
    //contact_packet.rec_email = userData.email;
    //contact_packet.rec_name = userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1) + " " + userData.lastName.charAt(0).toUpperCase() + userData.lastName.slice(1);
    //contact_packet.rec_role = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
    //contact_packet.rec_username = userData.username;
    //contact_packet.rec_password = userData.password;
    //contact_packet.send_name = req.user.firstName + " " + req.user.lastName;
    //contact_packet.send_email = req.user.email;
    //
    //User.remove({_id: req.params.id}, function (err) {
    //    if (!err) {
    //        res.send();
    //    } else {
    //        return res.send({ reason: err.toString() });
    //    }
    //});
    //contact.delete_user_confirmation(contact_packet);
    //res.send();
};
