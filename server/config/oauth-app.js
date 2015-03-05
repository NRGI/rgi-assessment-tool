/*jshint camelcase: false */
module.exports = function(app, config) {

    'use strict';

   

    // oauth2.authCode.getToken({
    //         redirect_uri: config.redirectUri,
    //         // code: code,
    //     }, function (err, res) {
    //         if (err) {
    //             console.log('Error exchanging token', err.message);
    //     //         // res.redirect('/404')
    //         } else {
    //             token = oauth2.accessToken.create(res);
    //             console.log(oauth2.accessToken);
    //     //         setCookies(res, result);
    //     //         res.redirect(home);
    //         }
    //     });

    // var oauth2 = require('simple-oauth2')({
    //     site: 'https://api.mendeley.com',
    //     clientID: config.clientId,
    //     clientSecret: config.clientSecret
    // });
// var oauth2  = require('simple-oauth2');
// var token;
// 

// // Initialize the OAuth2 Library
// var oauth = oauth2(credentials);
//  // Save the access token
// function saveToken(err, res) {
//     if (err) { console.log('Access Token Error', err.message); }
//     token = oauth.accessToken.create(res);
//     req.session.token = token.token;
// }
// Get the access token object for the client
// oauth.client.getToken({}, saveToken);


    var cookieParser = require('cookie-parser');
    var accessTokenCookieName = 'accessToken';
    var refreshTokenCookieName = 'refreshToken';


    var oauthPath = '/oauth/token';
    var home = '/';
    var tokenExchangePath = '/oauth/token-exchange';

    app.use(cookieParser());

    app.get('/mendeleyAuth', function (req, res) {
        if (!req.cookies[accessTokenCookieName]) {
            console.log('No cookie defined, redirecting to', tokenExchangePath);
            res.redirect(tokenExchangePath);
        } else {
            console.log('Access token set, redirecting to', home);
            app.set('mendeley', 'got');
            res.redirect('/');
        }
    });

    // app.get(tokenExchangePath, function (req, res, next) {
    //     console.log('Starting token exchange');
    //     // console.log(req.query);
    // //     var code = req.query.code;
    //     var token;
    // //     // console.log(oauth2);
    //     // oauth2.client.getToken({}, saveToken);

    //     oauth2.authCode.getToken({
    //         redirect_uri: config.redirectUri,
    //         // code: code,
    //     }, function (err, res) {
    //         if (err) {
    //             console.log('Error exchanging token', err.message);
    //     //         // res.redirect('/404')
    //         } else {
    //             token = oauth2.accessToken.create(res);
    //             console.log(oauth2.accessToken);
    //     //         setCookies(res, result);
    //     //         res.redirect(home);
    //         }
    //     });
    // });

    app.get(tokenExchangePath, function (req, res, next) {
        console.log('Starting token exchange');

        var oauth2  = require('simple-oauth2');
        var token;

        var credentials = {
            clientID: 1560,
            clientSecret: 'chBcJvsqMHLoD8mF',
            site: 'https://api.mendeley.com'
        };

        // Initialize the OAuth2 Library
        var oauth = oauth2(credentials);

        oauth.client.getToken({}, function (error, result) {
            if (error) {
                console.log('Access Token Error', error.message);
            } else {
                token = oauth.accessToken.create(result);
                setCookies(res, token.token);
                res.redirect(home);
            }
        });
    });


    // app.get('/login', function(req, res) {
    //     console.log('Logging in, clearing any existing cookies');
    //     res.clearCookie(accessTokenCookieName);
    //     res.clearCookie(refreshTokenCookieName);
    //     res.redirect(oauthPath);
    // });

    // app.get('/oauth/refresh', function(req, res, next) {

    //     console.log('Attempting to refresh access token');

    //     var cookies = req.cookies, json = '{ message: "unknown error"}', status;

    //     res.set('Content-Type', 'application/json');

    //     // No cookies? Don't bother trying to refresh and send a 401
    //     if (!cookies[refreshTokenCookieName]) {
    //         console.log('Cannot refresh as no refresh token cookie available')
    //         status = 401;
    //         json = '{ message: "Refresh token unavailable" }';
    //         res.status(status).send(json);
    //     }
    //     // Otherwise attempt refresh
    //     else {
    //         oauth2.AccessToken.create({
    //             access_token: cookies[accessTokenCookieName],
    //             refresh_token: cookies[refreshTokenCookieName]
    //         }).refresh(function(error, token) {
    //             // On error send a 401
    //             if (error) {
    //                 status = 401;
    //                 json = '{ message: "Refresh token invalid" }';
    //             }
    //             // Otherwise put new access/refresh token in cookies and send 200
    //             else {
    //                 status = 200;
    //                 setCookies(res, token.token);
    //                 json = '{ message: "Refresh token succeeded" }';
    //             }
    //             console.log('Refresh result:', status, json)
    //             res.status(status).send(json);
    //         });
    //     }
    // });

    function setCookies(res, token) {
        console.log(token);
        res.cookie(accessTokenCookieName, token.access_token, { maxAge: token.expires_in * 1000 });
        res.cookie(refreshTokenCookieName, token.refresh_token, { httpOnly: true });
    }
};