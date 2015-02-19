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
    var query = Question.findOne({_id:req.params.id}).select({ "question_text": 1});
    query.exec(function (err, question) {
        res.send(question);
    });
};

exports.updateQuestion = function (req, res) {
    var question_update = req.body,
        timestamp = new Date().toISOString();

    if (!req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }

    Question.findOne({_id: question_update._id}).exec(function (err, question) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        question.question_order = question_update.question_order;
        question.question_text = question_update.question_text;
        question.component = question_update.component;
        question.component_text = question_update.component.replace('_', ' ');
        question.question_choices = question_update.question_choices;

        if (question.modified) {
            question.modified.push({modifiedBy: req.user._id, modifiedDate: timestamp});
        } else {
            question.modified = {modifiedBy: req.user._id, modifiedDate: timestamp};
        }
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