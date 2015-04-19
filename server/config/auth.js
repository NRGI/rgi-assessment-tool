'use strict';
var passport = require('passport');

exports.authenticate = function (req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function (err, user) {
        // if (err) {return next(err); }
        if (err || !user) { res.send({success: false}); }
        req.logIn(user, function (err) {
            // if (err) {return next(err); }
            if (err) { res.send({success: false}); }
            req.user = user;
            req.clientId = 1560;
            // res.send({success: true, user: user});
            next();
        });
    });
    auth(req, res, next);
};

exports.passUser = function(req, res, next) {
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