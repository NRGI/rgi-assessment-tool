var crypto                 = require('crypto'),
    bodyParser             = require('body-parser'),
    cookieParser           = require('cookie-parser'),
    s3                     = require('s3'),
    fs                     = require('fs'),
    request                = require('request'),
    mendeleyConfig         = require('../config/oauth-config'),
    Document               = require('mongoose').model('Documents'),
    url                    = 'http://localhost',
    accessTokenCookieName  = 'accessToken',
    refreshTokenCookieName = 'refreshToken',
    oauthPath              = '/oauth/token',
    home                   = '/',
    tokenExchangePath      = '/oauth/token-exchange';

var client = s3.createClient({
    maxAsyncS3: 20,     // this is the default 
    s3RetryCount: 3,    // this is the default 
    s3RetryDelay: 1000, // this is the default 
    multipartUploadThreshold: 20971520, // this is the default (20 MB) 
    multipartUploadSize: 15728640, // this is the default (15 MB) 
    s3Options: {
        accessKeyId: "your s3 key",
        secretAccessKey: "your s3 secret",
        // any other options are passed to new AWS.S3() 
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
    },
});

exports.mendeleyAuth = function (req, res) {
    if (!req.cookies[accessTokenCookieName]) {
        console.log('No cookie defined, redirecting to', tokenExchangePath);
        res.redirect(tokenExchangePath);
    } else {
        console.log('Access token set, redirecting to', home);
        res.redirect(home);
    }
};

exports.tokenExchange = function (req, res, next) {
    function setCookies(res, token) {
        res.cookie(accessTokenCookieName, token.access_token, { maxAge: token.expires_in * 1000 });
        res.cookie(refreshTokenCookieName, token.refresh_token, { httpOnly: true });
    }

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
            res.redirect('/404');
        } else {
            token = oauth.accessToken.create(result);
            setCookies(res, token.token);
            res.send(home);
        }
    });
};

exports.fileUpload = function (req, res, next) {
    // get temp path of file upload
    var file_path = req.files.file.path;
    var read_stream = fs.createReadStream(file_path);
    var hash = crypto.createHash('sha1');
    // create async file stream to hash file and call api
    read_stream
        .on('data', function (chunk) {
            hash.update(chunk);
        })
        .on('end', function () {
            var file_hash = hash.digest('hex');
            Document.findOne({file_hash: file_hash}, function (err, doc_record) {
                if (doc_record==[]) {
                    
                }
            });

//                 search RGI db
//                 if result update records
//                 else
//                     search mendeley api
//                         if result upload data && upload to s3
//                         else
//                             upload file to mendley
//                             upload file to s3
//                             pop up mendeley edit form

// // exports.getQuestionsByID = function (req, res) {
// //     Question.findOne({_id: req.params.id}).exec(function (err, question) {
// //         res.send(question);
// //     });
// // };


//             var options = {
//                 url: 'https://api.mendeley.com/catalog?filehash=' + file_hash,
//                 auth: {
//                     'bearer': req.cookies[accessTokenCookieName]
//                 },
//                 json: true
//             }
//             // call mendely to check if file exists
//             request(options, function (err, res, body) {
//                 console.log(body[0].id);
//                 console.log(body[0].title);
//             })       
        });
    // destroy temp file
    fs.unlinkSync(req.files.file.path);
};