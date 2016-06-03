'use strict';
var passport       = require('passport'),
    mongoose       = require('mongoose'),
    LocalStrategy  = require('passport-local').Strategy,
    User           = mongoose.model('User');

module.exports = function () {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({username: username}).exec(function (err, user) {
                if (user && user.authenticate(password)) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    ));
    // passport.use(new OAuth2Strategy({
    //         authorizationURL: 'https://www.example.com/oauth2/authorize',
    //         tokenURL: 'https://www.example.com/oauth2/token',
    //         clientID: EXAMPLE_CLIENT_ID,
    //         clientSecret: EXAMPLE_CLIENT_SECRET,
    //         callbackURL: "http://localhost:3000/auth/example/callback"
    //     },
    //     function(accessToken, refreshToken, profile, cb) {
    //         User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //             return cb(err, user);
    //         });
    //     }
    // ));

    passport.serializeUser(function (user, done) {
        if (user) {
            done(null, user._id);
        }
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}).exec(function (err, user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    });
};