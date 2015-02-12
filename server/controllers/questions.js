var Question = require('mongoose').model('Question');

exports.getQuestions = function (req, res) {
    Question.find({}).exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getQuestionsByID = function (req, res) {
    Question.findOne({_id: req.params.id}).exec(function (err, question) {
        res.send(question);
    });
};


exports.getQuestionTextByID = function (req, res) {
    var query = Question.findOne({_id: req.params.id}).select({ "question_text": 1});
    query.exec(function (err, question) {
        res.send(question);
    });
};


exports.updateQuestion = function (req, res) {
    var questionUpdate = req.body;

    if (!req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }

    Question.findOne({_id: req.body._id}).exec(function (err, question) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        question.question_order = questionUpdate.question_order;
        question.row_id_org = questionUpdate.row_id_org
        question.row_id = questionUpdate.row_id;
        question.question_text = questionUpdate.question_text;
        question.component = questionUpdate.component;
        question.component_text = questionUpdate.component_text;
        question.question_choices = questionUpdate.question_choices;

        if (question.modified) {
            question.modified.push({modifiedBy: req.user._id});
        } else {
            question.modified = {modifiedBy: req.user._id};
        }
        // user.address = questionUpdate.address;
        question.save(function (err) {
            if (err) {
                return res.send({ reason: err.toString() });
            }
        });
    });
    res.send();
};

exports.deleteQuestion = function (req, res) {
    Question.remove({_id: req.params.id}, function (err) {
        if (!err) {
            res.send();
        } else {
            return res.send({ reason: err.toString() });
        }
    });
    res.send();
};