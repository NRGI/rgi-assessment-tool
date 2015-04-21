'use strict';
/*jslint nomen: true unparam: true*/

var crypto                 = require('crypto'),
    fs                     = require('fs'),
    request                = require('request'),
    Document               = require('mongoose').model('Documents'),
    MendeleyToken          = require('mongoose').model('MendeleyToken');

    // bodyParser             = require('body-parser'),
    // cookieParser           = require('cookie-parser'),
    // s3                     = require('s3'),

    // mendeleyConfig         = require('../config/oauth-config'),
    // url                    = 'http://localhost',
    // accessTokenCookieName  = 'accessToken',
    // refreshTokenCookieName = 'refreshToken',
    // oauthPath              = '/oauth/token',
    // home                   = '/',
    // tokenExchangePath      = '/oauth/token-exchange';

exports.tokenExist = function (req, res, next) {
    MendeleyToken.findOne({clientId: req.clientId}).exec(function (err, token) {
        if (err) {
            console.log('Error while finding access token: ', err);
        }
        if (token) {
            console.log('Token Exist');
            req.token = token;
            req.mendeleyTokenExist = true;
        } else {
            console.log('Token is not exist');
            req.token = null;
            req.mendeleyTokenExist = false;
        }

        req.validMendeleyToken = false;

        next();
    });
};

exports.getToken = function (req, res) {
    MendeleyToken.findOne({clientId: process.env.MENDELEY_CLIENTID}).exec(function (err, token) {
        res.send(token);
    });
};

exports.validateToken = function (req, res, next) {
    if (req.mendeleyTokenExist === true && req.validMendeleyToken === false) {
        var created_time = new Date(req.token.creationDate),
            cur_time = new Date(),
            passed_time = cur_time.getTime() - created_time.getTime();

        if ((Math.floor(passed_time) / 1000) >= req.token.expires_in) {
            req.validMendeleyToken = false;
        } else {
            req.validMendeleyToken = true;
        }
    }

    next();
};

exports.createToken = function (req, res, next) {
    if (req.mendeleyTokenExist === false && req.token !== null) {
        var token = {
            'access_token' : req.token.access_token,
            'clientId' : req.clientId,
            'clientSecret' : req.clientSecret,
            'expires_in' : req.token.expires_in
        };

        MendeleyToken.create(token, function (err, token) {
            if (!err) {
                req.token = token;
                req.mendeleyTokenExist = true;
                req.validMendeleyToken = true;
            }
            next();
        });
    } else {
        console.log('Token already exist');
        next();
    }
};

exports.updateToken = function (req, res, next) {
    if (req.mendeleyTokenExist === true && req.validMendeleyToken === false) {
        MendeleyToken.findOne({clientId: req.clientId}).exec(function (err, token) {
            if (err) {
                req.validMendeleyToken = false;
            } else {
                token.access_token = req.token.access_token;
                token.expires_in = req.token.expires_in;
                token.clientSecret = req.clientSecret;
                token.save(function (err) {
                    if (err) {
                        req.validMendeleyToken = false;
                    } else {
                        req.validMendeleyToken = true;
                    }
                });
            }

            next();
        });
    } else {
        next();
    }
};

exports.deleteToken = function (req, res) {
    MendeleyToken.remove({clientId: req.clientId}, function (err) {
        if (!err) {
            res.send();
        } else {
            res.status(500);
            return res.send({reason: err.toString()});
        }
    });
};

        // MendeleyToken.findOne({}).exec(function (err, token) {
        //     console.log(token);
        // });
exports.fileUpload = function (req, res, next) {
    var timestamp = new Date().toISOString();
    console.log(req.query.test);
    // get temp path of file upload
    var file_path = req.files.file.path,
        read_stream = fs.createReadStream(file_path),
        hash = crypto.createHash('sha1');

    MendeleyToken.findOne({}).exec(function (err, token) {
        // console.log(token.access_token);

        // create async file stream to hash file and call api
        read_stream
            .on('data', function (chunk) {
                hash.update(chunk);
            })
            .on('end', function () {
                var file_hash = hash.digest('hex');
                // console.log(file_hash);
                // searcher db for 
                Document.findOne({file_hash: file_hash}, function (err, doc_record) {
                    if (doc_record !== null) {
                        console.log('In doc collection');
                        // // update
                        // doc_record.assessments.push(req.query.assessment_id);
                        // doc_record.questions.push(req.query.question_id);
                        // doc_record.users.push(req.user._id);
                        // doc_record.modified.push({
                        //     modifiedBy: req.user._id,
                        //     modifiedDate: timestamp
                        // });
                        // doc_record.save(function (err) {
                        //     if (err) {
                        //         return res.send({ reason: err.toString() });
                        //     }
                        // });

                        // // update 
                        // answer.references.push({
                        //     title: doc_record.,
                        //     **author: ,
                        //     **URL: , // generated from upload path in S3
                        //     **document_ID: ,
                        //     **mendeley_ID: ,
                        //     file_hash: file_hash,
                        //     comment: {
                        //         date: timestamp,
                        //         **content: ,
                        //         author: req.user._id,
                        //         author_name: req.user.firstName + ' ' + req.user.lastName,
                        //         role: req.user.role
                        //     }
                        // });
                    } else {
                        // call mendely to check if file exists
                        var options = {
                            url: 'https://api.mendeley.com/catalog?filehash=' + file_hash,
                            auth: {
                                'bearer': token.access_token
                            },
                            json: true
                        };
                        request(options, function (err, res, mendeley_body) {
                            if (mendeley_body !== null) {
                                console.log('In mendeley not in mongo');
                                // console.log(mendeley_body);
                                // // upload to s3

                                // // create
                                // document = {
                                //     mendeley_ID: ,
                                //     file_hash: ,
                                //     s3_url: ,
                                //     metadata: {
                                //         author: ,
                                //         title: 
                                //     },
                                //     assessments: [ObjectId],
                                //     questions: [ObjectId],
                                //     users: [ObjectId],
                                //     modified: {
                                //         modifiedBy: ObjectId,
                                //         modifiedDate: timestamp
                                //     },
                                //     createdBy: ObjectId,
                                //     creationDate: timestamp
                                // }

                                // update
                                // answer.references.push({
                                //     title: ,
                                //     author: ,
                                //     URL: , // generated from upload path in S3
                                //     document_ID: ,
                                //     mendeley_ID: ,
                                //     file_hash: ,
                                //     comment: {
                                //         date: timestamp,
                                //         content: ,
                                //         author: ObjectId,
                                //         author_name: ,
                                //         role: 
                                //     }
                                // });
                            } else {
                                console.log('Not in mendeley not in mongo');


                                // upload to mendeley
                        //     update metadata via mendeley api
                        //     update answer, document

                            }
                        });
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
    });
};