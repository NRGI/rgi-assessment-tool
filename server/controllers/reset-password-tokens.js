'use strict';
/*jslint nomen: true unparam: true*/

var
    contact = require('../utilities/contact'),
    ResetPasswordToken = require('mongoose').model('ResetPasswordToken'),
    User = require('mongoose').model('User');

exports.create = function (req, res) {
    User.findOne({email: req.body.email}, function(findUserError, user) {
        if (findUserError || !user) {
            res.send({error: 'USER_NOT_FOUND'});
        } else {
            ResetPasswordToken.createByUser(user._id, function(error, token) {
                if(!error) {
                    contact.reset_password_confirmation(user, token._id);
                }
                res.send({error: error, token: token});
            });
        }
    });
};

exports.reset = function (req, res) {
    ResetPasswordToken.findOne({_id: req.body.token}, function (findTokenError, token) {
        if (findTokenError || !token) {
            res.send({error: 'TOKEN_NOT_FOUND'});
        } else {
            User.findOne({_id: token.user}, function(findUserError, user) {
                if (findUserError || !user) {
                    res.send({error: 'USER_NOT_FOUND'});
                } else {
                    user.setPassword(req.body.password, function(setPasswordError) {
                        if (setPasswordError) {
                            res.send({error: 'SET_PASSWORD_ERROR'});
                        } else {
                            token.remove(function() {});
                            res.send({});
                        }
                    });
                }
            });
        }
    });
};
