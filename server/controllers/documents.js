'use strict';

var crypto              =   require('crypto'),
    fs                  =   require('fs'),
    mime                =   require('mime'),
    request             =   require('request'),
    s3                  =   require('s3'),
    Answer              =   require('mongoose').model('Answer'),
    Document            =   require('mongoose').model('Documents'),
    FileUploadStatus    =   require('mongoose').model('FileUploadStatus'),
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
                            }),
    upload_bucket       =   process.env.DOC_BUCKET;
//MendeleyToken          = require('mongoose').model('MendeleyToken'),

var uploadFile = function(file, sendResponse, req, res) {
    var hash = crypto.createHash('sha1'),
        timestamp = new Date().toISOString(),
        file_extension = getFileExtension(file.path);

    fs.readFile(file.path, {encoding: 'utf8'}, function (err, data) {
        hash.update(data);
        // get hashed value of file as fingerprint
        var file_hash = hash.digest('hex');
        // search documents for hashed file
        Document.findOne({file_hash: file_hash}, function (err, document) {
            // if file exists tag for reference
            if (document !== null) {
                if(sendResponse) {
                    res.send(document);
                }
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

                Document.create({
                    file_hash: file_hash,
                    mime_type: file.type,
                    s3_url: 'https://s3.amazonaws.com/' + upload_bucket + '/' + file_hash + '.' + file_extension,
                    modified: [{
                        modifiedBy: req.user._id,
                        modifiedDate: timestamp
                    }],
                    createdBy: req.user._id,
                    creationDate: timestamp
                }, function (err, document) {
                    if(sendResponse) {
                        if (err) {
                            res.status(400);
                            res.send({reason: err.toString()});
                        } else {
                            res.send(document);
                        }
                    }
                });
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
        request({
                method: 'GET',
                uri: req.query.url
            }, function () {})
            .on('response', function(response) {
                if (response.statusCode === 200) {
                    var fileTotalSize = parseInt(response.headers['content-length'], 10);
                    var receivedDataSized = 0;
                    var filePath = '/tmp/' + getFileName(new Date().getTime(), req.user._id, getFileExtension(req.query.url));

                    var file = fs.createWriteStream(filePath);
                    response.pipe(file);

                    response
                        .on('data', function(data) {
                            receivedDataSized += data.length;
                            fileUploadStatus.setCompletion(receivedDataSized / fileTotalSize);
                        })
                        .on('end', function() {
                            file.close(function() {
                                uploadFile({path: filePath, type: mime.lookup(filePath)}, false, req, res);
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
                res.send({reason: err.toString()});
            });
    });
};

exports.fileCheck = function (req, res) {
    uploadFile(req.files.file, true, req, res);
};

exports.getDocuments = function (req, res) {
    var query = Document.find(req.query);
    query.exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getDocumentsByID = function (req, res) {
    console.log(req.params);
    Document.findOne({_id: req.params.id}).exec(function (err, document) {
        res.send(document);
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

    Document.findOne({_id: document_update._id}).exec(function (err, document) {
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

        var input_array = ['source', 'year', 'pages', 'volume', 'issue', 'websites', 'publisher', 'city', 'edition', 'institution', 'series', 'chapter', 'editors', 'country', 'translators', 'series_editor'];
        input_array.forEach(function (el) {
            if (el in document_update) {
                document[el] = document_update[el];
            }
        });

        // console.log(document);

        document.save(function (err) {
            if (err) {
                res.status(400);
                console.log(err);
                res.send({reason: err.toString()});
            }
            // if (err) {
            //     res.status(400);
            //     res.send({reason: err.toString()});
            // } else {
            //     res.send(document);
            // }
        });
    });
    // res.send();
};

exports.deleteDocument = function (req, res) {

    // Document.remove({_id: req.params.id}, function (err) {
    //     if (!err) {
    //         res.send();
    //     } else {
    //         return res.send({ reason: err.toString() });
    //     }
    // });
    // res.send();
};
