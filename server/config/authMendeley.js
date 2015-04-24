'use strict';
var oauth2 = require('simple-oauth2');
var mendeley = require('../controllers/mendeley');
var clientId = process.env.MENDELEY_CLIENTID;
var clientCredential = process.env.MENDELEY_CLIENTCRED;
var endPoint = 'https://api.mendeley.com';

exports.getToken = function (req, res, next) {
    if(req.mendeleyTokenExist == false || req.validMendeleyToken == false) {
        // get token from mendely api
        var credentials = {
            'clientID': clientId,
            'clientSecret': clientCredential,
            'site': endPoint
        };

        req.token = null;
        oauth2(credentials).client.getToken({}, function (error, result) {
            if (error) {
                console.log('Access Token Error: ', error.message);
            } else {
                console.log('received Token: ', result);
                req.token = result;
                req.clientId = clientId;
                req.clientSecret = clientCredential;
            }

            next();
        });
    }
    else {
        if(req.mendeleyTokenExist == true) {
            console.log('Token already exist');
        }
        if(req.validMendeleyToken == true) {
            console.log('Valid token already exist');
        }

        next();
    }
};