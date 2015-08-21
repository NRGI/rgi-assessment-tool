'use strict';
/*jslint nomen: true unparam: true*/

var Answer = require('mongoose').model('Answer'),
    Question = require('mongoose').model('Question'),
    Assessment = require('mongoose').model('Assessment');

exports.getAnswers = function (req, res, next) {

    if (req.user.hasRole('supervisor')) {
        Answer.find(req.query, function (err, answers) {
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
                Answer.find(req.query, function (err, answers) {
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
                Answer.find(req.query, function (err, answers) {
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
        if (String(req.user._id) !== String(answer.researcher_ID) && String(req.user._id) !== String(answer.reviewer_ID) && !req.user.hasRole('supervisor')) {
            res.sendStatus(404);
            return res.end();
        }
        res.send(answer);
    });
};

exports.createAnswers = function (req, res, next) {
    var new_answers, i, j;
    new_answers = req.body;


    Question.find({}).exec(function (err, questions) {
        for (i = questions.length - 1; i >= 0; i -= 1) {

            for (j = new_answers.length - 1; j >= 0; j -= 1) {

                if (questions[i]._id == new_answers[j].question_ID) {
                    new_answers[j].question_text = questions[i].question_text;
                    Answer.create(new_answers[j], function (err, answer) {
                        if (err) {
                            if (err.toString().indexOf('E11000') > -1) {
                                err = new Error('Duplicate answers');
                            }
                            res.status(400);
                            return res.send({reason: err.toString()});
                        }
                    });
                }
            }
        }
    });
    res.send();
};

exports.updateAnswer = function (req, res) {
    var answer_update = req.body,
        timestamp = new Date().toISOString();

    if (String(req.user._id) !== String(answer_update.researcher_ID) && String(req.user._id) !== String(answer_update.reviewer_ID) && !req.user.hasRole('supervisor')) {
        res.sendStatus(404);
        return res.end();
    }

    Answer.findOne({answer_ID: answer_update.answer_ID}, function (err, answer) {
        answer.status = answer_update.status;
        answer.comments = answer_update.comments;
        answer.refereces = answer_update.refereces;
        answer.flags = answer_update.flags;
        answer.questions_flagged = answer_update.questions_flagged;
        answer.references = answer_update.references;
        if (answer.modified) {
            answer.modified.push({modifiedBy: req.user._id, modifiedDate: timestamp});
        } else {
            answer.modified = {modifiedBy: req.user._id, modifiedDate: timestamp};
        }

        if (answer_update.hasOwnProperty('researcher_score')) {
            answer.researcher_score_history.push({date: timestamp, order: answer.researcher_score_history.length + 1, score: answer.researcher_score});
            answer.researcher_score = answer_update.researcher_score;
            answer.researcher_justification = answer_update.researcher_justification;
        }
        if (answer_update.hasOwnProperty('reviewer_score')) {
            answer.reviewer_score_history.push({date: timestamp, order: answer.reviewer_score_history.length + 1, score: answer.reviewer_score});
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
