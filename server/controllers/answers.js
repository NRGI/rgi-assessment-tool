'use strict';
/* global require */

var Answer      = require('mongoose').model('Answer'),
    Question    = require('mongoose').model('Question'),
    Assessment  = require('mongoose').model('Assessment'),
    async       = require('async');

exports.getAnswers = function (req, res, next) {

    if (req.user.hasRole('supervisor')) {
        Answer.find(req.query)
            .populate('question_ID', 'question_label question_text dejure question_criteria question_order component_text precept')
            .populate('references.author', 'firstName lastName role')
            .exec(function (err, answers) {
                if (err) { return next(err); }
                if (!answers) { return next(new Error('No answers found')); }
                res.send(answers);
            });
    } else {
        var criteria = {};
        criteria[req.user.role + '_ID'] = req.user._id;

        Assessment.find(criteria, {assessment_ID: 1}, function (err, assessments) {
            var assessments_ids = assessments.map(function (doc) { return doc.assessment_ID; });

            if (err) { return next(err); }
            if (!assessments) { return next(new Error('No assessments assigned to user')); }

            if (assessments_ids.indexOf(req.query.assessment_ID) > -1) {
                Answer.find(req.query)
                    .populate('question_ID', 'question_label question_text dejure question_criteria question_order component_text precept')
                    .exec(function (err, answers) {
                        if (err) { return next(err); }
                        if (!answers) { return next(new Error('No answers found')); }
                        res.send(answers);
                    });
            } else {
                res.sendStatus(404);
                return res.end();
            }
        });
    }
};

exports.getRawAnswers = function(req, res, next) {
    var limit = Number(req.params.limit),
        skip = Number(req.params.skip),
        query = req.query;

    async.waterfall([
        getHeaders,
        getAnswerCount,
        getAnswerSet
    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
    function getHeaders(callback) {
        var raw_answer_header = [
                'assessment_id',
                'answer_id',
                'status',
                'question_text',
                'researcher_score_letter',
                'researcher_score_text',
                'researcher_score_value',
                'reviewer_score_letter',
                'reviewer_score_text',
                'reviewer_score_value'
            ];
        callback(null, raw_answer_header);
    }
    function getAnswerCount(raw_answer_header, callback) {
        Answer.find(query).count().exec(function(err, answer_count) {
            if(answer_count) {
                callback(null, raw_answer_header, answer_count);
            } else {
                callback(err);
            }
        });
    }
    function getAnswerSet(raw_answer_header, answer_count, callback) {
        Answer.find(query)
            .lean()
            .populate('question_ID', 'question_label question_label question_text dejure question_criteria component_text precept')
            .sort({answer_ID: 'asc'})
            .skip(skip * limit)
            .limit(limit)
            .exec(function(err, answers) {
                var raw_answer_array = [],
                    answer_len = answers.length,
                    answer_counter = 0;
                answers.forEach(function (answer) {
                    answer_counter++
                    raw_answer_array.push({
                        assessment_id: answer.assessment_ID,
                        answer_id: answer.answer_ID,
                        status: answer.status,
                        question_text: answer.question_ID.question_text
                    });
                    if (answer.researcher_score) {
                        raw_answer_array[raw_answer_array.length-1].researcher_score_letter = answer.researcher_score.letter;
                        raw_answer_array[raw_answer_array.length-1].researcher_score_text = answer.researcher_score.text;
                        raw_answer_array[raw_answer_array.length-1].researcher_score_value = answer.researcher_score.value;
                    }
                    if (answer.reviewer_score) {
                        raw_answer_array[raw_answer_array.length-1].reviewer_score_letter = answer.reviewer_score.letter;
                        raw_answer_array[raw_answer_array.length-1].reviewer_score_text = answer.reviewer_score.text;
                        raw_answer_array[raw_answer_array.length-1].reviewer_score_value = answer.reviewer_score.value;
                    }
                    if (answer_len === answer_counter) {
                        callback(err, {raw_answer_header: raw_answer_header, raw_answer_array: raw_answer_array, count: answer_count});
                    }
                });
            });
    }

};

exports.getAnswersByID = function (req, res, next) {
    //.populate('question_ID', 'question_label question_text dejure question_criteria question_order component_text precept')
    Answer.findOne({answer_ID: req.params.answer_ID})
        .populate('question_ID')
        .populate('external_answer.author', 'firstName lastName role external_type')
        .populate('comments.author', 'firstName lastName role')
        .populate('flags.author', 'firstName lastName role')
        .populate('flags.addressed_to', 'firstName lastName role')
        .populate('references.document_ID', 'title s3_url type year source authors')
        .populate('references.interviewee_ID', 'firstName lastName role')
        .populate('references.author', 'firstName lastName role')
        .exec(function (err, answer) {
            if (err) { return next(err); }
            if (!answer) { return next(new Error('No answers found')); }
            res.send(answer);
        });
};

exports.createAnswers = function (req, res) {
    var new_answers, i;
    new_answers = req.body;

    function createNewAnswer(new_answer) {
        Answer.create(new_answer, function (err) {
            if (err) {
                if (err.toString().indexOf('E11000') > -1) {
                    err = new Error('Duplicate Assessment');
                }
                res.status(400);
                return res.send({reason: err.toString()});
            }
        });
    }

    for (i = new_answers.length - 1; i >= 0; i -= 1) {
        createNewAnswer(new_answers[i]);
    }
    res.send();
};

exports.updateAnswer = function (req, res, next) {
    var updateData = req.body,
        timestamp = new Date().toISOString();

    if (!req.user._id) {
        req.status = 404;
        next();
    } else {
        Answer.findOne({answer_ID: updateData.answer_ID}, function (err, answer) {
            var setFields = function(src, dst, fields) {
                fields.forEach(function(field) {
                    src[field] = dst[field];
                });
            };

            setFields(answer, updateData, [
                'status',
                'comments',
                'guidance_dialog',
                'references',
                'flags',
                'external_answer',
                'researcher_resolve_flag_required'
            ]);

            answer.last_modified = {modified_by: req.user._id, modified_date: timestamp};
            var scoreModified = false;

            ['researcher', 'reviewer'].forEach(function(userType) {
                if (updateData.hasOwnProperty(userType + '_score')) {
                    scoreModified = true;
                    setFields(answer, updateData, [userType + '_score']);

                    answer[userType + '_score_history'].push({
                        date: timestamp,
                        order: answer[userType + '_score_history'].length + 1,
                        score: answer[userType + '_score'],
                        justification: answer[userType + '_justification']
                    });
                }

                setFields(answer, updateData, [userType + '_justification']);
            });

            if (updateData.hasOwnProperty('final_score')) {
                scoreModified = true;
                setFields(answer, updateData, ['final_score', 'final_justification']);
                answer.final_role = updateData.final_role;
            }

            if(scoreModified) {
                req.last_modified = {user: req.user._id, date: timestamp};
                req.assessment_ID = answer.assessment_ID;
            }

            answer.save(function (err) {
                if (err !== null) {
                    req.error = err;
                }

                next();
            });
        });
    }
};
