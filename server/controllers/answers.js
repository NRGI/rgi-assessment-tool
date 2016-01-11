'use strict';
/* global require */

var Answer      = require('mongoose').model('Answer'),
    Question    = require('mongoose').model('Question'),
    Assessment  = require('mongoose').model('Assessment');

exports.getAnswers = function (req, res, next) {

    if (req.user.hasRole('supervisor')) {
        Answer.find(req.query)
            .populate('question_ID')
            .exec(function (err, answers) {
                if (err) { return next(err); }
                if (!answers) { return next(new Error('No answers found')); }
                res.send(answers);
            });
    } else if (req.user.role === 'researcher') {
        Assessment.find({'researcher_ID': req.user._id}, {assessment_ID: 1}, function (err, assessments) {
            var assessments_ids = assessments.map(function (doc) { return doc.assessment_ID; });

            if (err) { return next(err); }
            if (!assessments) { return next(new Error('No assessments assigned to user')); }

            if (assessments_ids.indexOf(req.query.assessment_ID) > -1) {
                Answer.find(req.query)
                    .populate('question_ID')
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
    } else if (req.user.role === 'reviewer') {
        Assessment.find({'reviewer_ID': req.user._id}, {assessment_ID: 1}, function (err, assessments) {
            var assessments_ids = assessments.map(function (doc) { return doc.assessment_ID; });

            if (err) { return next(err); }
            if (!assessments) { return next(new Error('No assessments assigned to user')); }

            if (assessments_ids.indexOf(req.query.assessment_ID) > -1) {
                Answer.find(req.query)
                    .populate('question_ID')
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

exports.getAnswersByID = function (req, res, next) {

    Answer.findOne({answer_ID: req.params.answer_ID}, function (err, answer) {
        if (err) { return next(err); }
        if (!answer) { return next(new Error('No answer found')); }
        res.send(answer);
    });
};

exports.createAnswers = function (req, res, next) {
    var new_answers, i;
    new_answers = req.body;

    function createNewAnswer(new_answer) {
        Answer.create(new_answer, function (err, answer) {
            if (err) {
                if (err.toString().indexOf('E11000') > -1) {
                    err = new Error('Duplicate answers');
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

exports.updateAnswer = function (req, res) {
    var answer_update = req.body,
        timestamp = new Date().toISOString();

    if (!req.user._id) {
        res.sendStatus(404);
        return res.end();
    }

    Answer.findOne({answer_ID: answer_update.answer_ID}, function (err, answer) {
        answer.status = answer_update.status;
        answer.comments = answer_update.comments;
        answer.references = answer_update.references;
        answer.flags = answer_update.flags;
        answer.last_modified = {modified_by: req.user._id, modified_date: timestamp};

        if (answer_update.hasOwnProperty('researcher_score')) {
            answer.researcher_score_history.push({date: timestamp, order: answer.researcher_score_history.length + 1, score: answer.researcher_score, justification: answer.researcher_justification});
            answer.researcher_score = answer_update.researcher_score;
            answer.researcher_justification = answer_update.researcher_justification;
        }
        if (answer_update.hasOwnProperty('reviewer_score')) {
            answer.reviewer_score_history.push({date: timestamp, order: answer.reviewer_score_history.length + 1, score: answer.reviewer_score, justification: answer.reviewer_justification});
            answer.reviewer_score = answer_update.reviewer_score;
            answer.reviewer_justification = answer_update.reviewer_justification;
        }
        if (answer_update.hasOwnProperty('final_score')) {
            answer.final_score = answer_update.final_score;
            answer.final_role = answer_update.final_role;
            answer.final_justification = answer_update.final_justification;
        }

        answer.save(function (err) {
            if (err) {
                res.send({ reason: err.toString() });
            }
        });
    });
    res.send();
};
