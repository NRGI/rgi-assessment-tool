/**
 * This is an example of the oauth config used for an authorization code flow.
 *
 * This requires server-to-server communication to do a token exchange. There
 * is an example expressjs app in server.js that demonstrates one way to do this.
 *
 * To use this config copy it to examples/auth-config.js, fill in your clientId and
 * clientSecret.
 */
try {
    module.exports = {
        clientId: null, // <-- Insert your client id
        clientSecret: null, // <-- Insert your client secret here
        responseType: 'code'
    };
} catch(e) {
    console.info('You don\'t need to include oauth config on client-side for auth code flow');
}
