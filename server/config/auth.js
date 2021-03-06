'use strict';

var AuthLog         = require('mongoose').model('AuthLog'),
    passport        = require('passport'),
    mongoose        = require('mongoose'),
    User            = mongoose.model('User');

exports.authenticate = function (req, res) {
    req.body.username = req.body.username.toLowerCase();

    var auth = passport.authenticate('local', function (err, user) {
        if (err || !user) {
            return res.send({success: false});
        } else if(user.disabled) {
            return res.send({success: false, reason: 'Account is deactivated'});
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.send({success: false});
            }

            req.user = user;
            AuthLog.log(req.user._id, 'sign-in');
            req.clientId = 1560;
            res.send({success: true, user: req.user});
        });
    });

    auth(req, res);
};

exports.apiAuthenticate = function (req, res, next) {
    // try {
    //     var username = req.query.user.toLowerCase(),
    //         password = req.query.password;
    //     // passport.use(new LocalStrategy(
    //     //     function (username, password, done) {
    //     //         console.log(username);
    //     //         User.findOne({username: username}).exec(function (err, user) {
    //     //             if (user && user.authenticate(password)) {
    //     //                 return done(null, user);
    //     //             } else {
    //     //                 return done(null, false);
    //     //             }
    //     //         });
    //     //     }
    //     // ));
    //
    //
    //     // var auth = passport.authenticate('local', function (err, user) {
    //     //     // console.log(req.query.user);
    //     //     // console.log(res.body);
    //     //     // console.log(next);
    //     //     // if (err) {return next(err); }
    //     //     if (err) { res.send("Unknown Error"); }
    //     //     // console.log(user);
    //     //     req.logIn(req.query.user, function (err) {
    //     //         console.log(err);
    //     //
    //     //         // if (err) {return next(err); }
    //     //         if (err) { res.send({success: false}); }
    //     //         req.user = user;
    //     //         AuthLog.log(req.user._id, 'sign-in');
    //     //         // res.send({success: true, user: user});
    //     //         next();
    //     //     });
    //     // });
    //     // auth(req, res, next);
    // }
    // catch(TypeError) {
    //     if (!req.query.user) { res.send("You must supply a username as a query param!"); }
    // }
};

// curl -X GET http://localhost:3030/api/raw_answers/50/0?user=cperry
exports.logout = function (req, res) {
    if (req.isAuthenticated()) {
        AuthLog.log(req.user._id, 'sign-out');
        req.logout();
    }
    res.end();
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