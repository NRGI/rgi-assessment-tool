'use strict';

var striptags = require('striptags');

var Answer      = require('mongoose').model('Answer'),
    Country     = require('mongoose').model('Country'),
    Question    = require('mongoose').model('Question'),
    Assessment  = require('mongoose').model('Assessment');

var filterAnswerScoreHistory = function(answer, skipJustificationComparison) {
    ['researcher', 'reviewer'].forEach(function(role) {
        var field = role + '_score_history';
        answer['raw_' + field] = answer[field].slice();
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
        getListFieldPrefix = function(field) {
            return field.substr(0, field.length - 1);
        },
        getScoreFieldPrefix = function(scoreType) {
            return scoreType + '_score';
        },
        copyScore = function(outputAnswer, inputAnswer, scoreType) {
            var field = getScoreFieldPrefix(scoreType);
            outputAnswer[field + '_letter'] = inputAnswer[field] ? inputAnswer[field].letter : '';
        },
        copyScoreWithJustification = function(outputAnswer, inputAnswer, scoreType) {
            outputAnswer[getScoreFieldPrefix(scoreType) + '_justification'] =
                striptags(inputAnswer[scoreType + '_justification']);
            copyScore(outputAnswer, inputAnswer, scoreType);
        },
        copyListValues = function(outputAnswer, inputAnswer, field, valuesNumber) {
            for(var index = 0; index < valuesNumber; index++) {
                var data = inputAnswer[field][index];

                if(data) {
                    outputAnswer[getListFieldPrefix(field) + (index + 1)] = striptags(data.content);
                }
            }
        },
        getListFields = function(fieldName, fieldsNumberNumber) {
            var fields = [];

            for(var index = 0; index < fieldsNumberNumber; index++) {
                fields.push(getListFieldPrefix(fieldName) + (index + 1));
            }

            return fields;
        };

    var answers = [], listLength = {comments: 0, flags: 0},
        getFieldCounter = function(answerData) {
            return function(field) {
                if(answerData[field].length > listLength[field]) {
                    listLength[field] = answerData[field].length;
                }
            };
        };

    req.answers.forEach(function(answerData) {
        Object.keys(listLength).forEach(getFieldCounter(answerData));
    });

    req.answers.forEach(function(answerData) {
        var answer = {};

        if(answerData.version === 'MI') {
            answer.version = 'Minerals';
        } else if(['HY', 'OI'].indexOf(answerData.version) > -1) {
            answer.version = 'Oil And Gas';
        }

        answer.answer_ID = answerData.answer_ID;
        answer.question_order = answerData.question_order;
        answer.question_text = answerData.question_ID.question_text;
        answer.status = answerData.status;

        for(scoreFieldIndex = 0; scoreFieldIndex < SCORE_FIELDS.length; scoreFieldIndex++) {
            copyScoreWithJustification(answer, answerData, SCORE_FIELDS[scoreFieldIndex]);
        }

        copyScoreWithJustification(answer, answerData, 'final');

        Object.keys(listLength).forEach(function(field) {
            copyListValues(answer, answerData, field, listLength[field]);
        });

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
        'final_score_justification',
        'final_score_letter'
    ];

    Object.keys(listLength).forEach(function(field) {
        exportedFields = exportedFields.concat(getListFields(field, listLength[field]));
    });

    res.send({data: answers, country: req.params.country, header: exportedFields});
};

exports.getAnswersByID = function (req, res) {
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
            var respondError = function(error) {
                console.error('The answer ' + req.params.answer_ID + ' is not found');
                res.status(400);
                return res.send({reason: error.toString()});
            };

            if(err) {
                return respondError(err);
            }

            if(!answer) {
                return respondError(new Error('No answers found'));
            }

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
                'comments',
                'external_answer',
                'flags',
                'guidance_dialog',
                'modified',
                'references',
                'researcher_resolve_flag_required',
                'status'
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
