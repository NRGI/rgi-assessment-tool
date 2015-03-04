'use strict';

var mendeley_id = 1550,
    mendeley_key = 'LVGVkcbkqiZLFg3B';

var credentials = {
    clientId: mendeley_id,
    clientID: mendeley_id,
    clientSecret: mendeley_key,
    site: 'https://api.mendeley.com'
};

var oauth2 = require('simple-oauth2')(credentials);

 // // Get the access token object. 
 //    var token;
 //    

 //    // Initialize the OAuth2 Library 
 //    var oauth2 = require('simple-oauth2')(credentials);

 //    oauth2.client.getToken({scope: 'all'}, saveToken);

 //    // Save the access token 
 //    function saveToken(error, result) {
 //        if (error) { console.log('Access Token Error', error.message); }
 //        // result.expires_in = 2592000; // 30 days in seconds
 //        token = oauth2.accessToken.create(result);
 //        // Check if the token is expired. If expired it is refreshed.
 //        if (token.expired()) {
 //            token.refresh(function(error, result) {
 //                token = result;
 //            });
 //        }
 //        // console.log(token);
 //    }