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

var
    processError = function(err, res) {
        res.status(400);
        return res.send({ reason: err.toString() });
    },
    getCloseConnectionHandler = function(res) {
        return function (err) {
            if (err) {
                return res.end();
            }
        };
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
    var updatedData = req.body;

    if (!req.user.hasRole('supervisor')) {
        res.status(404);
        return getCloseConnectionHandler(res)(true);
    }

    if (updatedData['0']) {
        var getCallback = function(assessments) {
            return function (err, question) {
                if (err) {
                    return processError(err, res);
                }

                question.question_v = question.question_v + 1;
                question.assessments = assessments;
                question.save(getCloseConnectionHandler(res));
            };
        };

        for(var i = 0; i < updatedData.length; i++) {
            Question.findOne({_id: updatedData[String(i)]._id}).exec(getCallback(updatedData[String(i)].assessments));
        }
    } else {
        Question.findOne({_id: updatedData._id})
            .exec(function (err, question) {
                if (err) {
                    return processError(err, res);
                }

                [
                    'question_use',
                    'question_order',
                    'question_type',
                    'question_label',
                    'precept',
                    'component',
                    'indicator',
                    'dejure',
                    'question_text',
                    'dependant',
                    'question_criteria',
                    'question_guidance_text',
                    'question_dependancies',
                    'comments',
                    'linkedOption'
                ].forEach(function(field) {
                        question[field] = updatedData[field];
                });

                var component = updatedData.component;
                if(component !== undefined) {
                    question.component_text = (component[0].toUpperCase() + component.substr(1)).replace('_', ' ');
                }

                question.last_modified = {modified_by: req.user._id, modified_date: new Date().toISOString()};
                question.question_v = question.question_v + 1;
                question.save(getCloseConnectionHandler(res));
            });
    }

    res.send();
};

exports.deleteQuestion = function (req, res) {
    Question.remove({_id: req.params.id}, function (err) {
        res.send(err ? {reason: err.toString()} : undefined);
    });
};
