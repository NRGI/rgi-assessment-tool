'use strict';
/* global require */
var crypto              =   require('crypto'),
    fs                  =   require('fs'),
    mime                =   require('mime'),
    request             =   require('request'),
    s3                  =   require('s3'),
    Answer              =   require('mongoose').model('Answer'),
    Doc                 =   require('mongoose').model('Documents'),
    FileUploadStatus    =   require('mongoose').model('FileUploadStatus'),
    phantom             =   require('phantom'),
    //MendeleyToken     =   require('mongoose').model('MendeleyToken'),
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
                        modified_by: req.user._id,
                        modified_date: timestamp
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

exports.uploadUrlSnapshot = function(req, res) {
    var width = 1024, height = 768, timeoutPeriod = 240000,
        terminateWithError = function(errorCode, ph) {
            res.send({error: errorCode});
            console.log(errorCode);

            if(ph) {
                ph.exit();
            }
        };

    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.setting('resourceTimeout', timeoutPeriod).then(function() {
                page.property('viewportSize', {width: width, height: height}).then(function () {
                    var timeout = setTimeout(function () {
                        terminateWithError('PAGE_LOADING_TIMEOUT_EXPIRED', ph);
                    }, timeoutPeriod);

                    page.open(req.query.url).then(function () {
                        clearTimeout(timeout);

                        page.evaluate(function () {
                            if ([undefined, null].indexOf(document) !== -1) {
                                return undefined;
                            }

                            if ([undefined, null].indexOf(document.body) !== -1) {
                                return undefined;
                            }

                            if ([undefined, null].indexOf(document.body.offsetHeight) !== -1) {
                                return undefined;
                            }

                            return document.body.offsetHeight;
                        }).then(function (actualHeight) {
                            if (actualHeight === undefined) {
                                terminateWithError('PAGE_DEFINE_HEIGHT_FAILURE', ph);
                            } else if (actualHeight > 3000) {
                                terminateWithError('TOO_LARGE_SIZE', ph);
                            } else {
                                page.property('viewportSize', {width: width, height: actualHeight}).then(function () {
                                    page.open(req.query.url).then(function () {
                                        var filePath = '/tmp/' + getFileName(new Date().getTime(), req.user._id, 'png');
                                        page.render(filePath);

                                        var interval = setInterval(function () {
                                            fs.exists(filePath, function (renderingCompleted) {
                                                if (renderingCompleted) {
                                                    uploadFile({path: filePath, type: mime.lookup(filePath)}, req,
                                                        function (errorUpload, doc) {
                                                            fs.unlink(filePath);

                                                            if (errorUpload) {
                                                                terminateWithError('S3_TRANSFER_FAILURE', ph);
                                                            } else {
                                                                res.send({result: doc});
                                                            }
                                                        }
                                                    );

                                                    page.close();
                                                    ph.exit();
                                                    clearInterval(interval);
                                                }
                                            });
                                        }, 250);
                                    }).catch(function () {
                                        terminateWithError('PAGE_CONNECT_FAILURE', ph);
                                    });
                                }).catch(function () {
                                    terminateWithError('VIEWPORT_RESIZE_FAILURE', ph);
                                });
                            }
                        }).catch(function () {
                            terminateWithError('PAGE_DEFINE_HEIGHT_FAILURE', ph);
                        });
                    }).catch(function () {
                        terminateWithError('PAGE_CONNECT_FAILURE', ph);
                    });
                }).catch(function () {
                    terminateWithError('VIEWPORT_RESIZE_FAILURE', ph);
                });
            }).catch(function () {
                terminateWithError('SET_TIMEOUT_FAILURE', ph);
            });
        }).catch(function() {
            terminateWithError('PAGE_OPEN_FAILURE', ph);
        });
    }).catch(function() {
        terminateWithError('PHANTOM_INITIALIZATION_FAILURE');
    });
};

exports.uploadRemoteFile = function (req, res) {
    FileUploadStatus.create({}, function(err, fileUploadStatus) {
        var timeoutId,
            timeoutPeriod = 20000,
            remoteFileRequest = request({
                method: 'GET',
                timeout: timeoutPeriod,
                uri: req.query.url
            }, function () {})
                .on('response', function(response) {
                    clearTimeout(timeoutId);

                    if (response.statusCode === 200) {
                        var fileTotalSize = response.headers['content-length'] ? parseInt(response.headers['content-length'], 10) : -1;
                        var receivedDataSized = 0;
                        var filePath = '/tmp/' +
                            getFileName(new Date().getTime(), req.user._id, getFileExtension(req.query.url));

                        var file = fs.createWriteStream(filePath);
                        response.pipe(file);

                        response
                            .on('data', function(data) {
                                receivedDataSized += data.length;
                                fileUploadStatus.setCompletion(fileTotalSize > 0 ? receivedDataSized / fileTotalSize : 0);
                            })
                            .on('end', function() {
                                file.close(function() {
                                    fileUploadStatus.setCompletion(1);
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
            }, timeoutPeriod);
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
    var document_update = req.body;

    Doc.findOne({_id: document_update._id}).exec(function (err, document) {
        document.last_modified = {
            modified_by: req.user._id,
            modified_date: new Date().toISOString()
        };

        var processedFields = [
            'answers',
            'assessments',
            'authors',
            'chapter',
            'city',
            'country',
            'date_published',
            'edition',
            'editors',
            'institution',
            'issue',
            'modified',
            'pages',
            'publisher',
            'questions',
            'series',
            'series_editor',
            'source',
            'status',
            'title',
            'translators',
            'type',
            'volume',
            'users',
            'websites',
            'year'
        ];

        processedFields.forEach(function (field) {
            if (field in document_update) {
                document[field] = document_update[field];
            }
        });

        document.save(function (err) {
            if (err) {
                res.status(400);
                res.send({reason: err.toString()});
            } else {
                res.send(document);
            }
        });
    });
};

exports.deleteDocument = function (req, res) {
    Doc.remove({_id: req.params.id}, function (err) {
        res.send(err ? {reason: err.toString()} : {});
    });
};
