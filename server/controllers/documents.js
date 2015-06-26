'use strict';
/*jslint nomen: true unparam: true*/

var crypto                 = require('crypto'),
    fs                     = require('fs'),
    request                = require('request'),
    s3                     = require('s3'),
    MendeleyToken          = require('mongoose').model('MendeleyToken'),
    Document               = require('mongoose').model('Documents'),
    Answer                 = require('mongoose').model('Answer'),
    client                 = s3.createClient({
                                maxAsyncS3: 20,     // this is the default 
                                s3RetryCount: 3,    // this is the default 
                                s3RetryDelay: 1000, // this is the default 
                                multipartUploadThreshold: 20971520, // this is the default (20 MB) 
                                multipartUploadSize: 15728640, // this is the default (15 MB) 
                                s3Options: {
                                    accessKeyId: process.env.RGI_AWS_ACCESS_KEY,
                                    secretAccessKey: process.env.RGI_AWS_SECRET_KEY
                                    // any other options are passed to new AWS.S3() 
                                    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
                                }
                            });

exports.fileCheck = function (req, res, next) {
    // get temp path of file upload
    var file_path = req.files.file.path,
        // read_stream = fs.createReadStream(file_path),
        hash = crypto.createHash('sha1'),
        timestamp = new Date().toISOString(),
        file_extension = file_path.split('.')[file_path.split('.').length - 1];

    if (file_extension === 'pdf') {
        fs.readFile(file_path, {encoding: 'utf8'}, function (err, data) {
            // Use the 'data' string here.
            hash.update(data);
            // get hashed value of file as fingerprint
            var file_hash = hash.digest('hex');
            // search documents for hashed file
            Document.findOne({file_hash: file_hash}, function (err, document) {
                // if file exists tag for reference
                if (document !== null) {
                    res.send(document);

                // if not upload to s3 with hashed value as file name,
                // create record with hash value and end url
                } else {
                    var new_document = {};
                    // upload parameters
                    var params = {
                      localFile: file_path,
                      s3Params: {
                        Bucket: 'rgi-upload-test',
                        Key: String(file_hash) + '.pdf'
                        // other options supported by putObject, except Body and ContentLength. 
                        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
                      },
                    };

                    var uploader = client.uploadFile(params);
                    uploader.on('error', function(err) {
                      console.error("unable to upload:", err.stack);
                    });
                    uploader.on('progress', function() {
                      console.log("progress", uploader.progressMd5Amount,
                                uploader.progressAmount, uploader.progressTotal);
                    });
                    uploader.on('end', function() {
                      console.log("done uploading");
                    });

                    new_document.file_hash = file_hash;
                    new_document.s3_url = 'https://s3.amazonaws.com/rgi-upload-test/' + file_hash + '.pdf';
                    new_document.modified = [{
                        modifiedBy: req.user._id,
                        modifiedDate: timestamp
                    }];
                    new_document.createdBy = req.user._id;
                    new_document.creationDate = timestamp;

                    Document.create(new_document, function (err, document) {
                        if (err) {
                            res.status(400);
                            res.send({reason: err.toString()});
                        } else {
                            res.send(document);
                        }
                    });
                }
            });
        });
    } else {
        res.status(400);
        res.send({reason: 'Document not a pdf'});
    }
    // destroy temp file
    // fs.unlink(req.files.file.path);
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
                res.send({reason: err.toString()})
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
