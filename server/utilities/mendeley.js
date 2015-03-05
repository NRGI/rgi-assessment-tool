var oauth2  = require('simple-oauth2');

exports.getMendeleyToken = function () {
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
        return token.token;
    }
    // Get the access token object for the client
    return oauth.client.getToken({}, saveToken);
};