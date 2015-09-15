'use strict';
/*jslint nomen: true unparam: true*/

var
    ResetPasswordToken = require('mongoose').model('ResetPasswordToken'),
    User = require('mongoose').model('User');

exports.create = function (req, res, next) {
    User.findOne({email: req.body.email}, function(findUserError, user) {
        if (findUserError || !user) {
            next(findUserError);
            res.send({error: 'USER_NOT_FOUND'});
        } else {
            ResetPasswordToken.createByUser(user._id, function(error, token) {
                if (error) next(error);
                res.send({error: error, token: token});
            });
        }
    });
};

exports.reset = function (req, res, next) {
    ResetPasswordToken.findOne({_id: req.body.token}, function (findTokenError, token) {
        if (findTokenError || !token) {
            next(findTokenError);
            res.send({error: 'TOKEN_NOT_FOUND'});
        } else {
            User.findOne({_id: token.user}, function(findUserError, user) {
                if (findUserError || !user) {
                    next(findUserError);
                    res.send({error: 'USER_NOT_FOUND'});
                } else {
                    user.setPassword(req.body.password, function(setPasswordError) {
                        if (setPasswordError) {
                            next(setPasswordError);
                            res.send({error: 'SET_PASSWORD_ERROR'});
                        } else {
                            res.send({});
                        }
                    });
                }
            });
        }
    });
};
