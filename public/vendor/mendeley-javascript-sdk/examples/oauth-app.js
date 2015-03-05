/*jshint camelcase: false */
module.exports = function(app, config) {

    'use strict';

    var oauth2 = require('simple-oauth2')({
        site: 'https://api.mendeley.com',
        clientID: config.clientId,
        clientSecret: config.clientSecret
    });

    var cookieParser = require('cookie-parser');
    var accessTokenCookieName = 'accessToken';
    var refreshTokenCookieName = 'refreshToken';
    var oauthPath = '/oauth';
    var examplesPath = '/examples';
    var tokenExchangePath = '/oauth/token-exchange';

    app.use(cookieParser());

    app.get('/', function(req, res) {
        if (!req.cookies[accessTokenCookieName]) {
            console.log('No cookie defined, redirecting to', oauthPath);
            res.redirect(oauthPath);
        }
        else {
            console.log('Access token set, redirecting to', examplesPath);
            res.redirect(examplesPath);
        }
    });

    app.get(oauthPath, function (req, res) {
        var authorizationUri = oauth2.AuthCode.authorizeURL({
            redirect_uri: config.redirectUri,
            scope: config.scope || 'all'
        });

        console.log('oauth started, redirecting to', authorizationUri);
        res.redirect(authorizationUri);
    });

    app.get(tokenExchangePath, function (req, res, next) {
        console.log('Starting token exchange');
        var code = req.query.code;
        oauth2.AuthCode.getToken({
            redirect_uri: config.redirectUri,
            code: code,
        }, function(error, result) {
            if (error) {
                console.log('Error exchanging token');
                res.redirect('/logout')
            } else {
                setCookies(res, result);
                res.redirect(examplesPath);
            }
        });
    });

    app.get('/login', function(req, res) {
        console.log('Logging in, clearing any existing cookies');
        res.clearCookie(accessTokenCookieName);
        res.clearCookie(refreshTokenCookieName);
        res.redirect(oauthPath);
    });

    app.get('/oauth/refresh', function(req, res, next) {

        console.log('Attempting to refresh access token');

        var cookies = req.cookies, json = '{ message: "unknown error"}', status;

        res.set('Content-Type', 'application/json');

        // No cookies? Don't bother trying to refresh and send a 401
        if (!cookies[refreshTokenCookieName]) {
            console.log('Cannot refresh as no refresh token cookie available')
            status = 401;
            json = '{ message: "Refresh token unavailable" }';
            res.status(status).send(json);
        }
        // Otherwise attempt refresh
        else {
            oauth2.AccessToken.create({
                access_token: cookies[accessTokenCookieName],
                refresh_token: cookies[refreshTokenCookieName]
            }).refresh(function(error, token) {
                // On error send a 401
                if (error) {
                    status = 401;
                    json = '{ message: "Refresh token invalid" }';
                }
                // Otherwise put new access/refresh token in cookies and send 200
                else {
                    status = 200;
                    setCookies(res, token.token);
                    json = '{ message: "Refresh token succeeded" }';
                }
                console.log('Refresh result:', status, json)
                res.status(status).send(json);
            });
        }
    });

    function setCookies(res, token) {
        res.cookie(accessTokenCookieName, token.access_token, { maxAge: token.expires_in * 1000 });
        res.cookie(refreshTokenCookieName, token.refresh_token, { httpOnly: true });
    }
};
