'use strict';
var oauth2  = require('simple-oauth2'),
    session = require('express-session');

module.exports = function (app) {

    // app.set('mendeley_token', function (app) {
    //     console.log(app.settings);
    //     // var token;
    //     // var credentials = {
    //     //     clientID: 1560,
    //     //     clientSecret: 'chBcJvsqMHLoD8mF',
    //     //     site: 'https://api.mendeley.com'
    //     // };

    //     // // Initialize the OAuth2 Library
    //     // var oauth = oauth2(credentials);
    //     //  // Save the access token
    //     // function saveToken(err, res) {
    //     //     if (err) { console.log('Access Token Error', err.message); }
    //     //     token = oauth.accessToken.create(res);
    //     //     console.log(token.token);
    //     //     return token.token;
    //     // }

    //     // // Get the access token object for the client
    //     // return oauth.client.getToken({}, saveToken);
    // });
    var token;
    var credentials = {
        clientID: 1560,
        clientSecret: 'chBcJvsqMHLoD8mF',
        site: 'https://api.mendeley.com'
    };

    // Initialize the OAuth2 Library
    var oauth = oauth2(credentials);
     // Save the access token
    function saveToken(err, res) {
        if (err) { console.log('Access Token Error', err.message); }
        token = oauth.accessToken.create(res);
        console.log(token.token);
    }

    // Get the access token object for the client
    app.set('mendeley_token', oauth.client.getToken({}, saveToken));
};