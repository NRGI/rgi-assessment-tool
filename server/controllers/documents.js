var Document = require('mongoose').model('Documents');

exports.getDocuments = function (req, res) {
    Document.find({}).exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getDocumentsByID = function (req, res) {
    Question.findOne({_id: req.params.id}).exec(function (err, question) {
        res.send(question);
    });
};

exports.getDocumentsHash = function (req, res) {
    Question.findOne({_id: req.params.id}).exec(function (err, question) {
        res.send(question);
    });
};

// exports.getQuestionTextByID = function (req, res) {
//     var query = Question.findOne({_id:req.params.id}).select({ "question_text": 1});
//     query.exec(function (err, question) {
//         res.send(question);
//     });
// };

// exports.updateQuestion = function (req, res) {
//     var question_update, timestamp;

//     question_update = req.body;
//     timestamp = new Date().toISOString();

//     if (!req.user.hasRole('supervisor')) {
//         res.status(404);
//         return res.end();
//     }

//     Question.findOne({_id: question_update._id}).exec(function (err, question) {
//         String.prototype.capitalize = function () {
//             return this.replace(/^./, function (match) {
//                 return match.toUpperCase();
//             });
//         };
//         if (err) {
//             res.status(400);
//             return res.send({ reason: err.toString() });
//         }
//         question.question_order = question_update.question_order;
//         question.question_text = question_update.question_text;
//         question.component = question_update.component;
//         question.component_text = question_update.component.replace('_', ' ').capitalize();
//         question.question_choices = question_update.question_choices;
//         question.comments = question_update.comments;

//         if (question.modified) {
//             question.modified.push({modifiedBy: req.user._id, modifiedDate: timestamp});
//         } else {
//             question.modified = {modifiedBy: req.user._id, modifiedDate: timestamp};
//         }

//         question.save(function (err) {
//             if (err) {
//                 console.log(err.toString());
//                 return res.end();
//             }
//         });
//     });
//     res.send();
// };

// exports.deleteQuestion = function (req, res) {

//     Question.remove({_id: req.params.id}, function (err) {
//         if (!err) {
//             res.send();
//         } else {
//             return res.send({ reason: err.toString() });
//         }
//     });
//     res.send();
// };