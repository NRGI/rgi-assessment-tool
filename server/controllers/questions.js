'use strict';

var Question = require('mongoose').model('Question');

exports.getQuestions = function (req, res) {
    Question.find(req.query).exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getQuestionByID = function (req, res) {
    Question.findOne({_id: req.params.id}).exec(function (err, question) {
        res.send(question);
    });
};

exports.getQuestionTextByID = function (req, res) {
    Question.findOne({_id: req.params.id}).select({ "question_text": 1}).exec(function (err, question) {
        res.send(question);
    });
};

var processError = function(err, res) {
    res.status(400);
    return res.send({ reason: err.toString() });
};

exports.createQuestions = function (req, res) {
    req.body.forEach(function(new_question) {
        Question.create(new_question, function (err) {
            if (err) {
                return processError(err, res);
            }
        });
    });

    res.send();
};

exports.updateQuestion = function (req, res) {
    var new_question_data, i,
        question_update = req.body,
        timestamp = new Date().toISOString();
    if (!req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }
    if (question_update['0']) {
        var getCallback = function(assessments) {
            return function (err, question) {
                if (err) {
                    return processError(err, res);
                }

                question.question_v = question.question_v + 1;
                question.assessments = assessments;

                question.save(function (err) {
                    if (err) {
                        return res.end();
                    }
                });
            };
        };

        for(i = 0; i < question_update.length; i++) {
            new_question_data = question_update[String(i)];
            Question.findOne({_id: new_question_data._id}).exec(getCallback(new_question_data.assessments));
        }
    } else {
        Question.findOne({_id: question_update._id})
            .exec(function (err, question) {
                String.prototype.capitalize = function () {
                    return this.replace(/^./, function (match) {
                        return match.toUpperCase();
                    });
                };
                if (err) {
                    return processError(err, res);
                }

                question.question_v = question.question_v + 1;
                question.question_use = question_update.question_use;
                question.question_order = question_update.question_order;
                question.question_type = question_update.question_type;
                question.question_label = question_update.question_label;
                question.precept = question_update.precept;
                question.component = question_update.component;
                question.component_text = question_update.component.replace('_', ' ').capitalize();
                question.indicator = question_update.indicator;
                question.dejure = question_update.dejure;
                question.question_text = question_update.question_text;
                question.dependant = question_update.dependant;
                question.question_criteria = question_update.question_criteria;
                //TODO deal with chang in criteria number and norm
                //question.question_norm = question_update.question_norm;
                question.question_guidance_text = question_update.question_guidance_text;
                question.question_dependancies = question_update.question_dependancies;
                question.comments = question_update.comments;
                question.linkedOption = question_update.linkedOption;
                question.last_modified = {modified_by: req.user._id, modified_dateti: timestamp};

                question.save(function (err) {
                    if (err) {
                        return res.end();
                    }
                });
            });
    }

    res.send();
};

exports.deleteQuestion = function (req, res) {
    Question.remove({_id: req.params.id}, function (err) {
        res.send(err ? {reason: err.toString()} : undefined);
    });
};
