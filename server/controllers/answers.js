'use strict';
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
    } else if (req.user.roles[0] === 'researcher') {
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
    } else if (req.user.roles[0] === 'reviewer') {
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
        answer.references = answer_update.references;
        if (answer.modified) {
            answer.modified.push({modifiedBy: req.user._id, modifiedDate: timestamp});
        } else {
            answer.modified = {modifiedBy: req.user._id, modifiedDate: timestamp};
        }

        if (answer_update.hasOwnProperty('researcher_score')) {
            answer.researcher_score_history.push({date: timestamp, order: answer.researcher_score_history.length + 1, score: answer.researcher_score});
            answer.researcher_score = answer_update.researcher_score;
        }
        if (answer_update.hasOwnProperty('reviewer_score')) {
            answer.reviewer_score_history.push({date: timestamp, order: answer.reviewer_score_history.length + 1, score: answer.reviewer_score});
            answer.reviewer_score = answer_update.reviewer_score;
        }

        answer.save(function (err) {
            if (err) {
                return res.send({ reason: err.toString() });
            }
        });
    });
    res.send();
};





    // if (req.user.hasRole('supervisor')) {

    // } else if (req.user.roles[0] === 'researcher') {
    //     Assessment.find({'researcher_ID': req.user._id}, {assessment_ID: 1}, function (err, assessments) {
    //         var assessments_ids = assessments.map(function (doc) { return doc.assessment_ID; });

    //         if (assessments_ids.indexOf(req.query.assessment_ID) !== -1) {
    //             console.log('ok');
    //             // Answer.findOne({answer_ID: req.params.answer_ID}, function (err, answers) {
    //             //     res.send(answers);
    //             // });
    //         } else {
    //             res.sendStatus(404);
    //             return res.end();
    //         }
    //     });
    // } else if (req.user.roles[0] === 'reviewer') {
    //     Assessment.find({'reviewer_ID': req.user._id}, {assessment_ID: 1}, function (err, assessments) {
    //         var assessments_ids = assessments.map(function (doc) { return doc.assessment_ID; });

    //         if (assessments_ids.indexOf(req.query.assessment_ID) !== -1) {
    //             console.log('ok');
    //             // Answer.findOne({answer_ID: req.params.answer_ID}, function (err, answers) {
    //             //     res.send(answers);
    //             // });
    //         } else {
    //             res.sendStatus(404);
    //             return res.end();
    //         }
    //     });
    // }


    // if (!req.user.hasRole('supervisor')) {
    //     res.sendStatus(404);
    //     return res.end();
    // }

    // Question.findOne({_id: req.body._id}).exec(function (err, question) {
    //     if (err) {
    //         res.status(400);
    //         return res.send({ reason: err.toString() });
    //     }
    //     question.question_order = questionUpdate.question_order;
    //     question.row_id_org = questionUpdate.row_id_org
    //     question.row_id = questionUpdate.row_id;
    //     question.question_text = questionUpdate.question_text;
    //     question.component = questionUpdate.component;
    //     question.component_text = questionUpdate.component_text;
    //     question.question_choices = questionUpdate.question_choices;

    //     if (question.modified) {
    //         question.modified.push({modifiedBy: req.user._id});
    //     } else {
    //         question.modified = {modifiedBy: req.user._id};
    //     }
    //     // user.address = questionUpdate.address;
    //     question.save(function (err) {
    //         if (err) {
    //             return res.send({ reason: err.toString() });
    //         }
    //     });
    // });
    // res.send();
