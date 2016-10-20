'use strict';
/* global require */
var bunyan              =   require('bunyan'),
    BunyanSlack         =   require('bunyan-slack'),
    crypto              =   require('crypto'),
    fs                  =   require('fs'),
    mime                =   require('mime'),
    request             =   require('request'),
    s3                  =   require('s3'),
    async               =   require('async'),
    Answer              =   require('mongoose').model('Answer'),
    Doc                 =   require('mongoose').model('Documents'),
    FileUploadStatus    =   require('mongoose').model('FileUploadStatus'),
    FILE_SIZE_LIMIT     =   400 * 1024 * 1024,//400MB
    path                =   require('path'),
    //MendeleyToken     =   require('mongoose').model('MendeleyToken'),
    upload_bucket       =   process.env.DOC_BUCKET,
    url                 =   require('url'),
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

var log = bunyan.createLogger({
    name: 'docs',
    streams: [
        {
            stream: new BunyanSlack({
                webhook_url: 'https://hooks.slack.com/services/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',
                channel: '#doc-logs-local',
                username: 'webhookbot'
            })
        },
        {
            stream: require('bunyan-mongodb-stream')({model: require('mongoose').model('Log')})
        }
    ]
});

var uploadFile = function(file, req, callback) {
    var hash = crypto.createHash('sha1'),
        timestamp = new Date().toISOString(),
        file_extension = getFileExtension(file.path);

    log.info('attempt to read the local file ' + file.path);

    fs.readFile(file.path, {encoding: 'utf8'}, function (err, data) {
        if(err) {
            log.error('error reading the local file ' + file.path + '. The error is ' + err);
            callback('Read file failure');
        } else {
            log.info('read successfully the local file ' + file.path);
            hash.update(data);
            // get hashed value of file as fingerprint
            var file_hash = hash.digest('hex');
            // search documents for hashed file
            log.info('search a document by the hash ' + file_hash + ' generated using the local file ' + file.path);
            Doc.findOne({file_hash: file_hash}, function (err, document) {
                // if file exists tag for reference
                if (document !== null) {
                    callback(null, document);
                    log.info('the hash ' + file_hash + ' is found. The file was uploaded already. Use the old document');
                    // if not upload to s3 with hashed value as file name,
                    // create record with hash value and end url
                } else {
                    log.info('the hash ' + file_hash + ' is not found. Transfer the file to S3');
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
                        log.error('the file ' + file_hash + '.' + file_extension +
                        ' has been failed to be transferred. The error is ' + err.stack);
                        console.error("unable to upload:", err.stack);
                        fs.unlink(file.path);
                        callback('File transfer failed');
                    });
                    uploader.on('progress', function() {
                        console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
                    });
                    uploader.on('end', function() {
                        log.info('the file ' + file_hash + '.' + file_extension + ' has been transferred successfully.');
                        console.log("done uploading");
                        fs.unlink(file.path);

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
                    });
                }
            });
        }
    });
};

var getFileExtension = function(filePath) {
    var dottedExtension = path.extname(url.parse(filePath).pathname).toLowerCase();
    return dottedExtension.split('.')[dottedExtension.split('.').length - 1];
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
            timeoutPeriod = 20000,
            remoteFileRequest = request({
                method: 'GET',
                timeout: timeoutPeriod,
                uri: req.query.url
            }, function () {})
                .on('response', function(response) {
                    clearTimeout(timeoutId);

                    if (response.statusCode === 200) {
                        var fileTotalSize = 0;

                        if(response.headers['content-length']) {
                            fileTotalSize = parseInt(response.headers['content-length'], 10);
                        }

                        if(fileTotalSize > FILE_SIZE_LIMIT) {
                            return res.send({reason: 'The file size is too large to be uploaded'});
                        }

                        var receivedDataSize = 0;
                        var filePath = '/tmp/' +
                            getFileName(new Date().getTime(), req.user._id, getFileExtension(req.query.url));

                        var file = fs.createWriteStream(filePath);
                        response.pipe(file);

                        response
                            .on('data', function(data) {
                                receivedDataSize += data.length;

                                if(receivedDataSize > FILE_SIZE_LIMIT) {
                                    fileUploadStatus.setCompletion(-1);
                                } else {
                                    fileUploadStatus.setCompletion(fileTotalSize > 0 ? receivedDataSize / fileTotalSize : 0);
                                }
                            })
                            .on('end', function() {
                                fileUploadStatus.setCompletion(1);

                                file.close(function() {
                                    uploadFile({path: filePath, type: mime.lookup(filePath)}, req, function (err, doc) {
                                        if (!err) {
                                            fileUploadStatus.setDocument(doc);
                                        }
                                    });
                                });
                            })
                            .on('error', function() {
                                file.close(function() {
                                    fs.unlink(filePath);
                                    fileUploadStatus.setCompletion(-1);
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
    log.info('UPLOAD A LOCAL FILE ' + req.files.file.path);

    uploadFile(req.files.file, req, function (err, document) {
        if (err) {
            res.status(400);
            res.send({reason: err.toString()});
        } else {
            res.send(document);
        }
    });
};

// exports.getDocuments = function (req, res) {
//     var limit = Number(req.params.limit),
//         skip = Number(req.params.skip),
//         query = Doc.find(req.query);
//     console.log(skip);
//     console.log(limit);
//     console.log(query);
//
//     query.exec(function (err, collection) {
//         res.send(collection);
//     });
// };

exports.getDocuments = function(req, res) {
    var limit = Number(req.params.limit),
        skip = Number(req.params.skip),
        query = req.query;

    query.title = {$exists: true};

    async.waterfall([
        function (callback) {
            Doc.find(query).count().exec(callback);
        },
        function (documentsNumber, callback) {
            Doc.find(query)
                .sort({
                    title: 'asc'
                })
                .skip(skip * limit)
                .limit(limit)
                .populate('users', 'firstName lastName')
                .exec(function(err, documents) {
                    callback(err, {data: documents, count: documentsNumber});
                });
        }
    ], function (err, result) {
        if (err) {
            res.send({reason: err.toString()});
        } else{
            res.send(result);
        }
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
