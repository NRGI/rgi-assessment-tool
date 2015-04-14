'use strict';
/*jslint nomen: true unparam: true regexp: true*/

var Question = require('mongoose').model('Question');

exports.getQuestions = function (req, res) {
    var query = Question.find(req.query);
    query.exec(function (err, collection) {
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

exports.createQuestions = function (req, res, next) {
    var new_questions, i;

    new_questions = req.body;

    for (i = 0; i < new_questions.length; i += 1) {
        Question.create(new_questions[i], function (err, question) {
            if (err) {
                res.status(400);
                return res.send({reason: err.toString()});
            }
        });
    }
    res.send();
};

exports.updateQuestion = function (req, res) {
    var question_update, timestamp;

    question_update = req.body;
    timestamp = new Date().toISOString();

    if (!req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }

    Question.findOne({_id: question_update._id}).exec(function (err, question) {
        String.prototype.capitalize = function () {
            return this.replace(/^./, function (match) {
                return match.toUpperCase();
            });
        };
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }

        if (question.question_order !== question_update.question_order) {
            var new_loc = question_update.question_order,
                old_loc = question.question_order,
                query = Question.find({});

            query.sort({question_order: 1}).exec(function (err, q) {
                var q_array = q.filter(function (el) {
                        return el.question_order !== old_loc;
                    }),
                    q_el = q[old_loc - 1];

                q_array.splice(new_loc - 1, 0, q_el);

                q_array.forEach(function (element, index) {
                    Question.findOne({_id: element._id}).exec(function (err, q_up) {
                        q_up.question_order = index + 1;
                        q_up.save();
                    });
                });
            });
            question.question_order = question_update.question_order;
        }

        question.question_text = question_update.question_text;
        question.component = question_update.component;
        question.component_text = question_update.component.replace('_', ' ').capitalize();
        question.question_choices = question_update.question_choices;
        question.comments = question_update.comments;

        if (question.modified) {
            question.modified.push({modifiedBy: req.user._id, modifiedDate: timestamp});
        } else {
            question.modified = {modifiedBy: req.user._id, modifiedDate: timestamp};
        }

        question.save(function (err) {
            if (err) {
                return res.end();
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