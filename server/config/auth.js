'use strict';
var passport = require('passport'),
    AuthLog = require('mongoose').model('AuthLog');

exports.authenticate = function (req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function (err, user) {
        // if (err) {return next(err); }
        if (err || !user) { res.send({success: false}); }
        req.logIn(user, function (err) {
            // if (err) {return next(err); }
            if (err) { res.send({success: false}); }
            req.user = user;
            AuthLog.log(req.user._id, 'sign-in');
            req.clientId = 1560;
            // res.send({success: true, user: user});
            next();
        });
    });
    auth(req, res, next);
};

exports.logout = function (req, res) {
    AuthLog.log(req.user._id, 'sign-out');
    req.logout();
    res.end();
};

exports.passUser = function (req, res) {
    return res.send({success: true, user: req.user});
};

exports.requiresApiLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.status(403);
        res.end();
    } else {
        next();
    }
};

exports.requiresRole = function (role) {
    return function (req, res, next) {
        if (!req.isAuthenticated() || req.user.role !== role) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    };
};