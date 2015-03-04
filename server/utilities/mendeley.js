'use strict';

exports.getToken = function () {
    var mendeley_id, mendeley_key, token, credentials, oauth2;

    mendeley_id = 1550;
    mendeley_key = 'LVGVkcbkqiZLFg3B';

    credentials = {
        clientId: mendeley_id,
        clientID: mendeley_id,
        clientSecret: mendeley_key,
        site: 'https://api.mendeley.com'
    };

    oauth2 = require('simple-oauth2')(credentials);

    token = oauth2.client.getToken({scope: 'all'}, function (err, res) {
        if (err) { console.log('Access Token Error', err.message); }

        // result.expires_in = 2592000; // 30 days in seconds
        token = oauth2.accessToken.create(res);
        // Check if the token is expired. If expired it is refreshed.
        if (token.expired()) {
            token.refresh(function(err, res) {
                token = result;
            });
        }
        console.log(token);
        return token.token;
    });

    console.log(token);
    // token = oauth2.client.getToken({scope: 'all'}, saveToken);

    // function saveToken(err, res) {
    //     if (err) { console.log('Access Token Error', err.message); }
    //     // result.expires_in = 2592000; // 30 days in seconds
    //     token = oauth2.accessToken.create(res);
    //     // Check if the token is expired. If expired it is refreshed.
    //     if (token.expired()) {
    //         token.refresh(function(err, res) {
    //             token = result;
    //         });
    //     }
    //     return token;
    // }
    // console.log(token);
    // return token;
};