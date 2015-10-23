'use strict';
/* global require */
var crypto              =   require('crypto'),
    fs                  =   require('fs'),
    mime                =   require('mime'),
    request             =   require('request'),
    s3                  =   require('s3'),
    Answer              =   require('mongoose').model('Answer'),
    Doc            =   require('mongoose').model('Documents'),
    FileUploadStatus    =   require('mongoose').model('FileUploadStatus'),
    upload_bucket       =   process.env.DOC_BUCKET,
    client              =   s3.createClient({
                                maxAsyncS3: 20,     // this is the default
                                s3RetryCount: 3,    // this is the default
                                s3RetryDelay: 1000, // this is the default
                                multipartUploadThreshold: 20971520, // this is the default (20 MB)
                                multipartUploadSize: 15728640, // this is the default (15 MB)
                                s3Options: {
                                    accessKeyId: process.env.DOC_AWS_ACCESS_KEY,
                                    secretAccessKey: process.env.DOC_AWS_SECRET_KEY
                                    // any other options are passed to new AWS.S3()
                                    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
                                }
                            });

//=======
///* global require */
//
//var crypto                 = require('crypto'),
//    fs                     = require('fs'),
//    request                = require('request'),
//    s3                     = require('s3'),
//    Doc               = require('mongoose').model('Documents'),
//    Answer                 = require('mongoose').model('Answer'),
//    client                 = s3.createClient({
//                                maxAsyncS3: 20,     // this is the default
//                                s3RetryCount: 3,    // this is the default
//                                s3RetryDelay: 1000, // this is the default
//                                multipartUploadThreshold: 20971520, // this is the default (20 MB)
//                                multipartUploadSize: 15728640, // this is the default (15 MB)
//                                s3Options: {
//                                    accessKeyId: process.env.DOC_AWS_ACCESS_KEY,
//                                    secretAccessKey: process.env.DOC_AWS_SECRET_KEY
//                                    // any other options are passed to new AWS.S3()
//                                    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
//                                }
//                            }),
//    upload_bucket       =   process.env.DOC_BUCKET;

//>>>>>>> address jshint warnings in server


    //MendeleyToken          = require('mongoose').model('MendeleyToken'),

var uploadFile = function(file, req, callback) {
    var hash = crypto.createHash('sha1'),
        timestamp = new Date().toISOString(),
        file_extension = getFileExtension(file.path);

    fs.readFile(file.path, {encoding: 'utf8'}, function (err, data) {
        hash.update(data);
        // get hashed value of file as fingerprint
        var file_hash = hash.digest('hex');
        // search documents for hashed file
        Doc.findOne({file_hash: file_hash}, function (err, document) {
            // if file exists tag for reference
            if (document !== null) {
                callback(null, document);
                // if not upload to s3 with hashed value as file name,
                // create record with hash value and end url
            } else {
                // upload parameters
                var params = {
                    localFile: file.path,
                    s3Params: {
                        Bucket: upload_bucket,
                        Key: String(file_hash) + '.' + file_extension
                        // other options supported by putObject, except Body and ContentLength.
                        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
                    }
                };

                var uploader = client.uploadFile(params);
                uploader.on('error', function(err) {
                    console.error("unable to upload:", err.stack);
                });
                uploader.on('progress', function() {
                    console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
                });
                uploader.on('end', function() {
                    console.log("done uploading");
                });

                Doc.create({
                    file_hash: file_hash,
                    mime_type: file.type,
                    s3_url: 'https://s3.amazonaws.com/' + upload_bucket + '/' + file_hash + '.' + file_extension,
                    modified: [{
                        modifiedBy: req.user._id,
                        modifiedDate: timestamp
                    }],
                    createdBy: req.user._id,
                    creationDate: timestamp
                }, callback);
            }
        });
    });
};

var getFileExtension = function(filePath) {
    return filePath.split('.')[filePath.split('.').length - 1];
};

var getFileName = function(timestamp, user, extension) {
    return user + '-' + timestamp + (extension ? ('.' + extension) : '');
};

exports.getRemoteFileUploadStatus = function (req, res) {
    FileUploadStatus.findOne({_id: req.params.statusId}, function(err, uploadStatus) {
        res.send(uploadStatus);
    });
};

exports.uploadRemoteFile = function (req, res) {
    FileUploadStatus.create({}, function(err, fileUploadStatus) {
        var timeoutId,
            remoteFileRequest = request({
                method: 'GET',
                uri: req.query.url
            }, function () {})
                .on('response', function(response) {
                    clearTimeout(timeoutId);

                    if (response.statusCode === 200) {
                        var fileTotalSize = parseInt(response.headers['content-length'], 10);
                        var receivedDataSized = 0;
                        var filePath = '/tmp/' +
                            getFileName(new Date().getTime(), req.user._id, getFileExtension(req.query.url));

                        var file = fs.createWriteStream(filePath);
                        response.pipe(file);

                        response
                            .on('data', function(data) {
                                receivedDataSized += data.length;
                                fileUploadStatus.setCompletion(receivedDataSized / fileTotalSize);
                            })
                            .on('end', function() {
                                file.close(function() {
                                    uploadFile({path: filePath, type: mime.lookup(filePath)}, req, function (err, doc) {
                                        if (!err) {
                                            fileUploadStatus.setDocument(doc);
                                        }
                                    });
                                });
                            })
                            .on('error', function(err) {
                                file.close(function() {
                                    fs.unlink(filePath);
                                    res.send({reason: err.toString()});
                                });
                            });

                        res.send({
                            _id: fileUploadStatus._id,
                            completion: fileUploadStatus.completion,
                            size: fileTotalSize
                        });

                    } else {
                        res.send({reason: 'The file is not found'});
                    }
                })
                .on('error', function(err) {
                    clearTimeout(timeoutId);
                    res.send({reason: err.toString()});
                });


            timeoutId = setTimeout(function() {
                remoteFileRequest.abort();
                res.send({reason: 'File request timeout'});
            }, 2000);
    });
};

exports.fileCheck = function (req, res) {
    uploadFile(req.files.file, req, function (err, document) {
        if (err) {
            res.status(400);
            res.send({reason: err.toString()});
        } else {
            res.send(document);
        }
    });
};

exports.getDocuments = function (req, res) {
    var query = Doc.find(req.query);
    query.exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getDocumentsByID = function (req, res) {
    Doc.findOne({_id: req.params.id}).exec(function (err, document) {
        res.send(document);
    });
};

exports.getUploadStatusDocument = function (req, res) {
    FileUploadStatus.findOne({_id: req.params.statusId}).exec(function (errorUploadStatus, uploadStatus) {
        if (errorUploadStatus) {
            res.status(500).send({reason: errorUploadStatus.toString()});
        } else if (!uploadStatus || (uploadStatus.document === undefined)) {
            res.status(404).send({reason: 'not found'});
        } else {
            Doc.findOne({_id: uploadStatus.document}).exec(function (errorDocument, document) {
                if (errorDocument) {
                    res.status(500).send({reason: errorDocument.toString()});
                } else if (!document) {
                    res.status(404).send({reason: 'not found'});
                } else {
                    res.send(document);
                }
            });
        }
    });
};

// exports.getUsersByID = function (req, res) {
//     User.findOne({_id: req.params.id}).exec(function (err, user) {
//         res.send(user);
//     });
// };

exports.updateDocument = function (req, res) {
    var document_update, timestamp;

    document_update = req.body;
    timestamp = new Date().toISOString();

    Doc.findOne({_id: document_update._id}).exec(function (err, document) {
        document.title = document_update.title;
        document.authors = document_update.authors;
        document.type = document_update.type;
        document.assessments = document_update.assessments;
        document.questions = document_update.questions;
        document.answers = document_update.answers;
        document.users = document_update.users;
        document.modified = document_update.modified;
        document.status = document_update.status;
        document.modified.push({
            modifiedBy: req.user._id,
            modifiedDate: timestamp
        });

        var input_array = ['source', 'year', 'date_published', 'pages', 'volume', 'issue', 'websites', 'publisher', 'city', 'edition', 'institution', 'series', 'chapter', 'editors', 'country', 'translators', 'series_editor'];
        input_array.forEach(function (el) {
            if (el in document_update) {
                document[el] = document_update[el];
            }
        });

        document.save(function (err) {
            if (err) {
                res.status(400);
                res.send({reason: err.toString()});
            }
        });
    });
    // res.send();
};

exports.deleteDocument = function (req, res) {

    // Doc.remove({_id: req.params.id}, function (err) {
    //     if (!err) {
    //         res.send();
    //     } else {
    //         return res.send({ reason: err.toString() });
    //     }
    // });
    // res.send();
};
