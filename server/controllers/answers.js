'use strict';
/* global require */

var Answer      = require('mongoose').model('Answer'),
    Country     = require('mongoose').model('Country'),
    Question    = require('mongoose').model('Question'),
    Assessment  = require('mongoose').model('Assessment');

var filterAnswerScoreHistory = function(answer, skipJustificationComparison) {
    ['researcher', 'reviewer'].forEach(function(role) {
        var field = role + '_score_history';
        answer[field] = getFilteredScoreHistory(answer[field], skipJustificationComparison);
    });
};

var getFilteredScoreHistory = function(rawHistory, skipJustificationComparison) {
    if(rawHistory.length <= 1) {
        return rawHistory;
    }

    var getScoreValue = function(score) {
        return (score === undefined) || (score === null) ? score : score.value;
    };

    var filteredHistory = [rawHistory[0]];

    for(var hisoryIndex = 1; hisoryIndex < rawHistory.length; hisoryIndex++) {
        var prevHistoryRecord = rawHistory[hisoryIndex - 1];
        var historyRecord = rawHistory[hisoryIndex];

        if((getScoreValue(historyRecord.score) !== getScoreValue(prevHistoryRecord.score)) ||
            ((historyRecord.justification !== prevHistoryRecord.justification) && !skipJustificationComparison)) {
            filteredHistory.push(historyRecord);
        }
    }

    return filteredHistory;
};

exports.getAnswers = function (req, res, next) {
    if (req.user.hasRole('supervisor')) {
        Answer.find(req.query)
            .populate('question_ID', 'question_label question_text dejure question_criteria question_order component_text precept')
            .populate('references.author', 'firstName lastName role')
            .exec(function (err, answers) {
                if (err) { return next(err); }
                if (!answers) { return next(new Error('No answers found')); }

                answers.forEach(function(answer) {
                    filterAnswerScoreHistory(answer);
                });

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

exports.listPublicData = function(req, res) {
    if (req.params.assessment_ID !== undefined) {
        Answer.find({assessment_ID: req.params.assessment_ID})
            .populate('question_ID', 'question_label question_text dejure question_criteria question_order component_text precept')
            .populate('references.author', 'firstName lastName role')
            .exec(function (err, answers) {
                if (err) { return res.send({reason: err}); }

                answers.forEach(function(answer) {
                    filterAnswerScoreHistory(answer);
                });

                res.send(answers);
            });
    } else {
        res.sendStatus(404);
        return res.end();
    }
};

exports.getAnswersPortion = function(req, res, next) {
    var limit = Number(req.params.limit),
        query = req.params.country ? {answer_ID: {$regex: new RegExp('^' + req.params.country + '.*')}} : {};

    if(req.deletedAssessments !== undefined) {
        query.assessment_ID = {$nin: req.deletedAssessments};
    }

    var getIso2Code = function(iso3Code, countries) {
        var iso2Code = iso3Code;

        countries.forEach(function(country) {
            if(iso3Code === country.country_ID) {
                iso2Code = country.iso2;
            }
        });

        return iso2Code;
    };

    Country.find().exec(function (err, countries) {
        if (err) {
            return res.send({reason: err.toString()});
        }

        Answer.find(query)
            .lean()
            .populate('question_ID', 'question_label question_label question_text dejure question_criteria component_text precept')
            .sort({answer_ID: 'asc'})
            .skip(Number(req.params.skip) * limit)
            .limit(limit)
            .exec(function(err, answers) {
                if(err) {
                    res.send({reason: err.toString()});
                } else {
                    req.answers = answers;

                    answers.forEach(function(answer) {
                        var idComponents = answer.answer_ID.split('-');
                        idComponents[0] = getIso2Code(idComponents[0], countries);
                        answer.iso2_code = idComponents.join('-');
                        filterAnswerScoreHistory(answer, true);
                    });

                    next();
                }
            });
    });
};

exports.getExportedAnswersData = function(req, res) {
    var
        scoreFieldIndex, SCORE_FIELDS = ['researcher', 'reviewer'],
        getScoreFieldPrefix = function(scoreType) {
            return scoreType + '_score';
        },
        getHistoryFieldPrefix = function(scoreType) {
            return getScoreFieldPrefix(scoreType) + '_history';
        },
        copyScore = function(outputAnswer, inputAnswer, scoreType) {
            var field = getScoreFieldPrefix(scoreType);
            outputAnswer[field + '_letter'] = inputAnswer[field] ? inputAnswer[field].letter : '';
        },
        copyScoreWithJustification = function(outputAnswer, inputAnswer, scoreType) {
            outputAnswer[getScoreFieldPrefix(scoreType) + '_justification'] = inputAnswer[scoreType + '_justification'];
            copyScore(outputAnswer, inputAnswer, scoreType);
        },
        copyScoreHistory = function(outputAnswer, inputAnswer, scoreType, historySize) {
            var prefix = getHistoryFieldPrefix(scoreType);

            for(var historyIndex = 0; historyIndex < historySize; historyIndex++) {
                var scoreHistory = inputAnswer[prefix][historyIndex];

                if(scoreHistory) {
                    outputAnswer[prefix + '_date' + (historyIndex + 1)] = scoreHistory.date.toISOString();

                    if(scoreHistory.score) {
                        outputAnswer[prefix + '_order' + (historyIndex + 1)] = scoreHistory.score.order;
                        outputAnswer[prefix + '_score_letter' + (historyIndex + 1)] = scoreHistory.score.letter;
                    }
                }
            }
        },
        getHistoryFields = function(scoreType, historySize) {
            var fields = [], POSTFIXES = ['date', 'order', 'score_letter'];

            for(var historyIndex = 0; historyIndex < historySize; historyIndex++) {
                for(var postfixIndex = 0; postfixIndex < POSTFIXES.length; postfixIndex++) {
                    fields.push(getHistoryFieldPrefix(scoreType) + '_' + POSTFIXES[postfixIndex] + (historyIndex + 1));
                }
            }

            return fields;
        };

    var answers = [];
    var historyLength = {researcher: 0, reviewer: 0};
    var scoreType, fieldName;

    req.answers.forEach(function(answerData) {
        for(scoreFieldIndex = 0; scoreFieldIndex < SCORE_FIELDS.length; scoreFieldIndex++) {
            scoreType = SCORE_FIELDS[scoreFieldIndex];
            fieldName = getHistoryFieldPrefix(scoreType);

            if(answerData[fieldName].length > historyLength[scoreType]) {
                historyLength[scoreType] = answerData[fieldName].length;
            }
        }
    });

    req.answers.forEach(function(answerData) {
        var answer = {};

        if(answerData.version === 'MI') {
            answer.version = 'Minerals';
        } else if(answerData.version === 'HY') {
            answer.version = 'Hydrocarbons';
        }

        answer.answer_ID = answerData.answer_ID;
        answer.question_order = answerData.question_order;
        answer.question_text = answerData.question_ID.question_text;
        answer.status = answerData.status;
        answer.iso2_code = answerData.iso2_code;

        for(scoreFieldIndex = 0; scoreFieldIndex < SCORE_FIELDS.length; scoreFieldIndex++) {
            copyScoreWithJustification(answer, answerData, SCORE_FIELDS[scoreFieldIndex]);
        }

        copyScore(answer, answerData, 'final');

        var externalAnswer;

        if(answerData.external_answer.length > 0) {
            externalAnswer = answerData.external_answer[answerData.external_answer.length - 1];
        } else {
            externalAnswer = {comment: '', justification: '', score: {letter: ''}};
        }

        answer.external_answer_letter = externalAnswer.score.letter;
        answer.external_justification = externalAnswer.justification;
        answer.external_comment = externalAnswer.comment;

        for(scoreFieldIndex = 0; scoreFieldIndex < SCORE_FIELDS.length; scoreFieldIndex++) {
            scoreType = SCORE_FIELDS[scoreFieldIndex];
            copyScoreHistory(answer, answerData, scoreType, historyLength[scoreType]);
        }

        Object.keys(answer).forEach(function(field) {
            if((answer[field] === undefined) || (answer[field] === null)) {
                answer[field] = '';
            }
        });

        answers.push(answer);
    });

    var exportedFields = [
        'answer_ID',
        'version',
        'question_order',
        'question_text',
        'status',
        'researcher_score_justification',
        'researcher_score_letter',
        'reviewer_score_justification',
        'reviewer_score_letter',
        'final_score_letter',
        'external_answer_letter',
        'external_justification',
        'external_comment'
    ];

    exportedFields = exportedFields.concat(getHistoryFields('researcher', historyLength.researcher));
    exportedFields = exportedFields.concat(getHistoryFields('reviewer', historyLength.reviewer));
    res.send({data: answers, country: req.params.country, header: exportedFields});
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

            filterAnswerScoreHistory(answer);
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
