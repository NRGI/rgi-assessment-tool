'use strict';
/*jslint nomen: true unparam: true*/

var crypto                 = require('crypto'),
    fs                     = require('fs'),
    request                = require('request'),
    aws                    = require('aws-sdk'),
    Document               = require('mongoose').model('Documents'),
    Answer                 = require('mongoose').model('Answer'),
    MendeleyToken          = require('mongoose').model('MendeleyToken');



exports.fileCheck = function (req, res, next) {
    // get temp path of file upload
    var file_path = req.files.file.path,
        // read_stream = fs.createReadStream(file_path),
        hash = crypto.createHash('sha1');

    fs.readFile(file_path, {encoding: 'utf8'}, function (err, data) {
        // Use the 'data' string here.
        hash.update(data);
        var file_hash = hash.digest('hex');
        Document.findOne({file_hash: file_hash}, function (err, document) {
            if (document !== null) {
                res.send(document);
            } else {
                res.send({});
                // upload to s3
                // create document record
                // send back
            }
        });

        // res.send(hash_out);
    });
    // console.log(hash_out);


    // read_stream
    //     .on('data', function (chunk) {
    //         hash.update(chunk);
    //     })
    //     .on('end', function () {
    //         var file_hash = hash.digest('hex');
    //         console.log(file_hash);

    //         // searcher db for file
    //         Document.findOne({file_hash: file_hash}, function (err, document) {
    //             res.send(req.files);
    //         });
    //     });
};

// exports.fileCreate = function () {
//     var timestamp = new Date().toISOString();

//     // get temp path of file upload
//     var file_path = req.files.file.path,
//         read_stream = fs.createReadStream(file_path),
//         hash = crypto.createHash('sha1');

//     // create async file stream to hash file and call api
//     read_stream
//         .on('data', function (chunk) {
//             hash.update(chunk);
//         })
//         .on('end', function () {
//             var file_hash = hash.digest('hex');

//             // searcher db for file
//             Document.findOne({file_hash: file_hash}, function (err, doc_record) {
//                 if (doc_record !== null) {
//                     console.log('UPDATE');
//                     // update
//                     doc_record.assessments.push(req.query.assessment_id);
//                     doc_record.questions.push(req.query.question_id);
//                     doc_record.users.push(req.user._id);
//                     doc_record.modified.push({
//                         modifiedBy: req.user._id,
//                         modifiedDate: timestamp
//                     });
//                     doc_record.save(function (err) {
//                         if (err) {
//                             return res.send({ reason: err.toString() });
//                         }
//                     });

//                     // update
//                     Answer.findOne({answer_ID: req.query.answer_id}, function (err, answer) {
//                         answer.references.push({
//                             title: doc_record.metadata.title,
//                             author:  doc_record.metadata.author,
//                             URL: doc_record.s3_url, // generated from upload path in S3
//                             document_ID: doc_record._id,
//                             // mendeley_ID: doc_record.mendeley_ID,
//                             file_hash: file_hash,
//                             comment: {
//                                 date: timestamp,
//                                 // content: ,
//                                 author: req.user._id,
//                                 author_name: req.user.firstName + ' ' + req.user.lastName,
//                                 role: req.user.role
//                             }
//                         });
//                         answer.save(function (err) {
//                             if (err) {
//                                 return res.send({ reason: err.toString() });
//                             }
//                         });
//                     });
//                 } else {
//                     console.log('CREATE');
//                     // // upload to s3
//                     // // get s3 url

//                     // create new document
//                     var doc_data = {
//                         // mendeley_ID: mendeley_body[0].id,
//                         file_hash: file_hash,
//                         // s3_url: ,
//                         // mendeley_url: mendeley_body[0].link,
//                         metadata: {
//                             author: mendeley_body[0].author,
//                             title: mendeley_body[0].title
//                         },
//                         title: mendeley_body[0].title
//                         assessments: [req.query.assessment_id],
//                         questions: [req.query.question_id],
//                         users: [req.user._id],
//                         modified: {
//                             modifiedBy: req.user._id,
//                             modifiedDate: timestamp
//                         },
//                         createdBy: req.user._id,
//                         creationDate: timestamp
//                     }

//                     // Document.create(doc_data, function (err, document) {
//                     //     if (err) {
//                     //         if (err.toString().indexOf('E11000') > -1) {
//                     //             err = new Error('Duplicate Username');
//                     //         }
//                     //         res.status(400);
//                     //         return res.send({reason: err.toString()});
//                     //     }
//                     // });

//                     // // update
//                     // Answer.findOne({answer_ID: req.query.answer_id}, function (err, answer) {
//                     //     answer.references.push({
//                     //         title: doc_record.metadata.title,
//                     //         author:  doc_record.metadata.author,
//                     //         URL: doc_record.s3_url, // generated from upload path in S3
//                     //         document_ID: doc_record._id,
//                     //         mendeley_ID: doc_record.mendeley_ID,
//                     //         file_hash: file_hash,
//                     //         comment: {
//                     //             date: timestamp,
//                     //             // content: ,
//                     //             author: req.user._id,
//                     //             author_name: req.user.firstName + ' ' + req.user.lastName,
//                     //             role: req.user.role
//                     //         }
//                     //     });
//                     //     answer.save(function (err) {
//                     //         if (err) {
//                     //             return res.send({ reason: err.toString() });
//                     //         }
//                     //     });
//                     // });
//                 }
//             });


// //                 search RGI db
// //                 if result update records
// //                 else
// //                     search mendeley api
// //                         if result upload data && upload to s3
// //                         else
// //                             upload file to mendley
// //                             upload file to s3
// //                             pop up mendeley edit form

// // // exports.getQuestionsByID = function (req, res) {
// // //     Question.findOne({_id: req.params.id}).exec(function (err, question) {
// // //         res.send(question);
// // //     });
// // // };


// //             var options = {
// //                 url: 'https://api.mendeley.com/catalog?filehash=' + file_hash,
// //                 auth: {
// //                     'bearer': req.cookies[accessTokenCookieName]
// //                 },
// //                 json: true
// //             }
// //             // call mendely to check if file exists
// //             request(options, function (err, res, body) {
// //                 console.log(body[0].id);
// //                 console.log(body[0].title);
// //             })       
//         });
//     // destroy temp file
//     fs.unlinkSync(req.files.file.path);
// }