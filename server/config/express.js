'use strict';
var express      = require('express'),
    stylus       = require('stylus'),
    logger       = require('morgan'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    passport     = require('passport');

module.exports = function (app, config, mendeley_id, mendeley_key) {
    // function for use by stylus middleware
    function compile(str, path) {
        return stylus(str).set('filename', path);
    }
    // set up view engine
    app.set('views', config.rootPath + 'server/views');
    app.set('view engine', 'jade');
    // set up logger
    app.use(logger('dev'));
    app.set('token', function () {
        var token;
        var credentials = {
            clientId: mendeley_id,
            clientID: mendeley_id,
            clientSecret: mendeley_key,
            site: 'https://api.mendeley.com'
        };

        // Initialize the OAuth2 Library 
        var oauth2 = require('simple-oauth2')(credentials);

        oauth2.client.getToken({scope: 'all'}, saveToken);

        // Save the access token 
        function saveToken(error, result) {
            if (error) { console.log('Access Token Error', error.message); }
            // result.expires_in = 2592000; // 30 days in seconds
            token = oauth2.accessToken.create(result);
            // Check if the token is expired. If expired it is refreshed.
            if (token.expired()) {
                token.refresh(function(error, result) {
                    token = result;
                });
            }
                        // console.log(token);
        }
        return token;

    });

    // // Get the access token object. 
    // var token;
    // var credentials = {
    //     clientId: mendeley_id,
    //     clientID: mendeley_id,
    //     clientSecret: mendeley_key,
    //     site: 'https://api.mendeley.com'
    // };

    // // Initialize the OAuth2 Library 
    // var oauth2 = require('simple-oauth2')(credentials);

    // oauth2.client.getToken({scope: 'all'}, saveToken);

    // // Save the access token 
    // function saveToken(error, result) {
    //     if (error) { console.log('Access Token Error', error.message); }
    //     // result.expires_in = 2592000; // 30 days in seconds
    //     token = oauth2.accessToken.create(result);
    //     // Check if the token is expired. If expired it is refreshed.
    //     if (token.expired()) {
    //         token.refresh(function(error, result) {
    //             token = result;
    //         });
    //     }
    //     console.log(token);
    // }
    // console.log(app.settings);
    // app.set('token', token);

    // authentication cofigs
    app.use(cookieParser());

    app.use(bodyParser());

    app.use(session({secret: 'All your base are belong to us'}));
    app.use(session({token: 'token'}));
    // app.use(session(cookie.token='token'));
    // console.log(app.get('session'));
    // app.use(function printSession(req, res, next) {
    //     console.log(req.session);
    //     next();
    // });
    app.use(passport.initialize());

    // app.use(function(req, res, next) {
    //     var sess = req.session;
    //     res.send(console.log(sess));

    // });

    app.use(passport.session());

    // stylus middleware implementation - routes to anything in public directory
    app.use(stylus.middleware(
        {
            src: config.rootPath + '/public',
            compile: compile
        }
    ));
    app.use(express.static(config.rootPath + '/public'));
};