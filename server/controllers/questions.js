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
    var questions = [], maximalOptionsNumber = 0,
        OPTION_FIELDS = ['letter', 'text'], BASIC_FIELDS = ['question_order', 'question_v', 'question_text'],
        getSetOptionHandler = function(question, optionIndex, options) {
            return function(field) {
                var outputFieldName = 'question_criteria_' + field + (optionIndex + 1);
                question[outputFieldName] = optionIndex < options.length ? options[optionIndex][field] : undefined;
            };
        };

    req.questions.forEach(function(questionData) {
        if(questionData.question_criteria.length > maximalOptionsNumber) {
            maximalOptionsNumber = questionData.question_criteria.length;
        }
    });

    req.questions.forEach(function(questionData) {
        var question = {}, lastModified = questionData.last_modified, lastModifiedBy = lastModified.modified_by;

        BASIC_FIELDS.forEach(function(field) {
            question[field] = questionData[field];
        });

        for(var optionIndex = 0; optionIndex < maximalOptionsNumber; optionIndex++) {
            OPTION_FIELDS.forEach(getSetOptionHandler(question, optionIndex, questionData.question_criteria));
        }

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

    var columns = BASIC_FIELDS.slice(),
        getColumnNameHandler = function(columnNames, optionIndex) {
            return function(field) {
                columnNames.push('question_criteria_' + field + (optionIndex + 1));
            };
        };

    for(var optionIndex = 0; optionIndex < maximalOptionsNumber; optionIndex++) {
        OPTION_FIELDS.forEach(getColumnNameHandler(columns, optionIndex));
    }

    res.send({data: questions, header: columns.concat(['last_modified_modified_by', 'last_modified_modified_date'])});
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
