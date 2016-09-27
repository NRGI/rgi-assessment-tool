'use strict';

var Question = require('mongoose').model('Question');
var generalResponse = require('../utilities/general-response');

exports.getQuestions = function (req, res) {
    Question.find(req.query).exec(function (err, questions) {
        res.send(err ? {reason: err.toString()} : questions);
    });
};

exports.getQuestionByID = function (req, res) {
    Question.findOne({_id: req.params.id}).exec(function (err, question) {
        res.send(err ? {reason: err.toString()} : question);
    });
};

exports.getQuestionsPortion = function(req, res, next) {
    var portionSize = Number(req.params.limit);

    Question.find(req.query)
        .lean()
        .populate('last_modified.modified_by', 'firstName lastName username email role')
        .sort({question_order: 'asc'})
        .skip(Number(req.params.skip) * portionSize)
        .limit(portionSize)
        .exec(function(err, questions) {
            if(err) {
                res.send({reason: err.toString()});
            } else {
                req.questions = questions;
                next();
            }
        });
};

exports.getExportedQuestionsData = function(req, res) {
    var questions = [],
        getCriteriaFieldSet = function(question, field) {
            var values = [];

            question.question_criteria.forEach(function(criterion) {
                values.push(criterion[field]);
            });

            return JSON.stringify(values).split('"').join('\'');
        };

    req.questions.forEach(function(questionData) {
        var question = {}, lastModified = questionData.last_modified, lastModifiedBy = lastModified.modified_by;

        ['question_order', 'question_v', 'question_text'].forEach(function(field) {
            question[field] = questionData[field];
        });

        ['letter', 'text'].forEach(function(field) {
            question['question_criteria_' + field] = getCriteriaFieldSet(questionData, field);
        });

        if(lastModifiedBy) {
            if(lastModifiedBy.firstName && lastModifiedBy.lastName) {
                question.last_modified_modified_by = lastModifiedBy.firstName + ' ' + lastModifiedBy.lastName +
                (lastModifiedBy.email ? ' (' + lastModifiedBy.email + ')' : '');
            } else {
                question.last_modified_modified_by = lastModifiedBy.email;
            }
        }

        question.last_modified_modified_date = lastModified.modified_date;

        Object.keys(question).forEach(function(field) {
            if((question[field] === undefined) || (question[field] === null)) {
                question[field] = '';
            }
        });

        questions.push(question);
    });

    res.send({data: questions, header: [
        'question_order',
        'question_v',
        'question_text',
        'question_criteria_letter',
        'question_criteria_text',
        'last_modified_modified_by',
        'last_modified_modified_date'
    ]});
};

var getCloseConnectionHandler = function(res) {
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
                return generalResponse.respondError(res, err);
            }
        });
    });

    res.send();
};

exports.updateQuestion = function (req, res) {
    var updatedData = req.body;

    if (!req.user.hasRole('supervisor')) {
        return generalResponse.respondStatus(res, 404);
    }

    if (updatedData['0']) {
        var getCallback = function(assessments) {
            return function (err, question) {
                if (err) {
                    return generalResponse.respondError(res, err);
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
                    return generalResponse.respondError(res, err);
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
