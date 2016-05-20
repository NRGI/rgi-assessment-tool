'use strict';
/* global require */

var Answer      = require('mongoose').model('Answer'),
    Question    = require('mongoose').model('Question'),
    Assessment  = require('mongoose').model('Assessment');

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

exports.getAnswersByID = function (req, res, next) {
<<<<<<< HEAD
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
=======

    Answer.findOne({answer_ID: req.params.answer_ID}, function (err, answer) {
        if (err) { return next(err); }
        if (!answer) { return next(new Error('No answer found')); }
        //if (String(req.user._id) !== String(answer.researcher_ID) && String(req.user._id) !== String(answer.reviewer_ID) && !req.user.hasRole('supervisor')) {
        //    res.sendStatus(404);
        //    return res.end();
        //}
        res.send(answer);
    });
>>>>>>> a36829db08c82844e4c05cf309557594404f579b
};

exports.createAnswers = function (req, res) {
    var new_answers, i;
    new_answers = req.body;

<<<<<<< HEAD
    function createNewAnswer(new_answer) {
        Answer.create(new_answer, function (err) {
            if (err) {
                if (err.toString().indexOf('E11000') > -1) {
                    err = new Error('Duplicate Assessment');
=======

    Question.find({}).exec(function (err, questions) {
        for (i = questions.length - 1; i >= 0; i -= 1) {

            for (j = new_answers.length - 1; j >= 0; j -= 1) {

                if (questions[i]._id == new_answers[j].question_ID) {
                    new_answers[j].question_text = questions[i].question_text;
                    console.log(new_answers[j]);
                    Answer.create(new_answers[j], function (err, answer) {
                        if (err) {
                            if (err.toString().indexOf('E11000') > -1) {
                                err = new Error('Duplicate answers');
                            }
                            res.status(400);
                            return res.send({reason: err.toString()});
                        }
                    });
>>>>>>> a36829db08c82844e4c05cf309557594404f579b
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

<<<<<<< HEAD
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
=======
    //if (String(req.user._id) !== String(answer_update.researcher_ID) && !req.user.hasRole('supervisor')) {
    //    res.sendStatus(404);
    //    return res.end();
    //}
>>>>>>> a36829db08c82844e4c05cf309557594404f579b

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
