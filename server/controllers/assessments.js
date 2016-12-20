'use strict';
/* global require */

var logger      = require('../logger/logger'),
    Answer      = require('mongoose').model('Answer'),
    Assessment  = require('mongoose').model('Assessment'),
    Document    = require('mongoose').model('Documents'),
    Interviewee = require('mongoose').model('Interviewee'),
    Question    = require('mongoose').model('Question'),
    User        = require('mongoose').model('User'),
    _           = require('underscore'),
    async       = require('async'),
    contact     = require('../utilities/contact');

exports.getAssessments = function (req, res, next) {

    if (req.query.ext_reviewer_ID) {
        try {
            req.query.ext_reviewer_ID = JSON.parse(req.query.ext_reviewer_ID);
        } catch (e) {
        }
    }
    Assessment.find(req.query)
        .populate('assignment_date.user', 'firstName lastName role email')
        .populate('researcher_start_date.user', 'firstName lastName role email')
        .populate('reviewer_start_date.user', 'firstName lastName role email')
        .populate('researcher_submit_date.user', 'firstName lastName role email')
        .populate('reviewer_submit_date.user', 'firstName lastName role email')
        .populate('last_review_date.user', 'firstName lastName role email')
        .populate('approval_date.user', 'firstName lastName role email')
        .populate('last_modified.user', 'firstName lastName role email')
        .populate('researcher_ID', 'firstName lastName role email')
        .populate('reviewer_ID', 'firstName lastName role email')
        .populate('reviewer_ID', 'firstName lastName role email')
        .populate('supervisor_ID', 'firstName lastName role email')
        .populate('ext_reviewer_ID', 'firstName lastName role email')
        .exec(function (err, assessments) {
            if (err) { return next(err); }
            if (!assessments) { return next(new Error('No assessments found')); }
            res.send(assessments);
        });
};

exports.list = function (req, res) {
    Assessment.find({deleted: {$ne: true}}).exec(function (err, assessments) {
        res.send(err ? {reason: err.toString()} : assessments);
    });
};

exports.setNonDeletedAssessmentCriteria = function(req, res, next) {
    Assessment.find({deleted: true}).exec(function(err, assessments) {
        if(!err) {
            req.deletedAssessments = [];

            assessments.forEach(function(assessment) {
              req.deletedAssessments.push(assessment.assessment_ID);
            });
        }

        next();
    });
};
exports.renameAssessment = function(req, res) {
    var assessment_ID = req.params.assessment_ID,
        respond = function(err) {
            res.send(err ? {reason: err.toString()} : '');
        };

    Assessment.findOne({assessment_ID: req.params.assessment_ID}).exec(function (err, assessment) {
        if((err === null) && (assessment === null)) {
            err = 'The requested assessment is not found';
        }

        if(err !== null) {
            return respond(err);
        }

        var assessmentIdComponents = assessment_ID.split('-');

        if(assessmentIdComponents[0] === assessment.ISO3) {
            return respond('Already renamed');
        }

        assessmentIdComponents[0] = assessment.ISO3;
        var newAssessmentId = assessmentIdComponents.join('-');
        assessment.assessment_ID = newAssessmentId;

        var getObjectRenamer = function(object) {
            return function(callback) {
                object.save(callback);
            };
        };

        var getObjectInstance = function(objectData, modelName) {
            if(modelName === 'User') {
                return new User(objectData);
            } else if(modelName === 'Question') {
                return new Question(objectData);
            } else if(modelName === 'Interviewee') {
                return new Interviewee(objectData);
            } else {
                return new Document(objectData);
            }
        };

        var getRenamer = function(model, modelName, field, getLinkedAssessmentIndex) {
            return function(callback) {
                if(getLinkedAssessmentIndex === undefined) {
                    getLinkedAssessmentIndex = function(assessments) {
                        return assessments.indexOf(assessment_ID);
                    };
                }

                var criteria = {};
                criteria[field || 'assessments'] = assessment_ID;

                model.find(criteria).exec(function(err, objects) {
                    var renameObjects = [];

                    if(!err) {
                        objects.forEach(function(object) {
                            if(field === undefined) {
                                object.assessments[getLinkedAssessmentIndex(object.assessments)] = newAssessmentId;
                            } else {
                                object.assessments[getLinkedAssessmentIndex(object.assessments)][field.split('.')[1]] = newAssessmentId;
                            }

                            if((object.answers !== undefined) && (object.answers !== null)) {
                                for(var answerIndex = 0; answerIndex < object.answers.length; answerIndex++) {
                                    object.answers[answerIndex] = object.answers[answerIndex].replace(assessment_ID, newAssessmentId);
                                }
                            }

                            renameObjects.push(getObjectRenamer(getObjectInstance(object, modelName)));
                        });
                    }

                    async.parallel(renameObjects, callback);
                });
            };
        };

        var getAnswerSaver = function(answer) {
            return function(callback) {
                answer.assessment_ID = newAssessmentId;
                answer.answer_ID = answer.answer_ID.replace(assessment_ID, newAssessmentId);
                answer.save(callback);
            };
        };

        Answer.find({assessment_ID: req.params.assessment_ID}).exec(function (errAnswer, answers) {
            if(errAnswer !== null) {
                return respond(err);
            }

            var renameModels = [assessment.save];

            answers.forEach(function(answer) {
                renameModels.push(getAnswerSaver(answer));
            });

            [
                {model: Document, modelName: 'Document'},
                {model: Interviewee, modelName: 'Interviewee'},
                {model: Question, modelName: 'Question'},
                {model: User, modelName: 'User', field: 'assessments.assessment_ID', getIndex: function(assessments) {
                    var assessmentIndex = -1;

                    assessments.forEach(function(assessment, index) {
                        if(assessment.assessment_ID === assessment_ID) {
                            assessmentIndex = index;
                        }
                    });

                    return assessmentIndex;
                }}
            ].forEach(function(linkedItem) {
                renameModels.push(getRenamer(linkedItem.model, linkedItem.modelName, linkedItem.field, linkedItem.getIndex));
            });

            async.parallel(renameModels, function (err) {
                res.send(err ? {reason: err.toString()} : 'ASSESSMENT RENAMED SUCCESSFULLY!!!');
            });
        });
    });
};

exports.unlinkAssessment = function(req, res) {
    var assessment_ID = req.params.assessment_ID;
    var linkedData = [
        {model: Document},
        {model: Interviewee},
        {model: Question},
        {model: User, field: 'assessments.assessment_ID', unlink: function(assessments) {
            var assessmentIndex = -1;

            assessments.forEach(function(assessment, index) {
                if(assessment.assessment_ID === assessment_ID) {
                    assessmentIndex = index;
                }
            });

            return assessmentIndex;
        }}
    ];

    var getObjectUnlinker = function(object) {
        return function(callback) {
            object.save(callback);
        };
    };

    var getUnlinker = function(model, field, getLinkedAssessmentIndex) {
        return function(callback) {
            if(getLinkedAssessmentIndex === undefined) {
                getLinkedAssessmentIndex = function(assessments) {
                    return assessments.indexOf(assessment_ID);
                };
            }

            var criteria = {};
            criteria[field || 'assessments'] = assessment_ID;

            model.find(criteria).exec(function(err, objects) {
                var unlinkObjects = [];

                if(!err) {
                    objects.forEach(function(object) {
                        object.assessments.splice(getLinkedAssessmentIndex(object.assessments), 1);
                        unlinkObjects.push(getObjectUnlinker(object));
                    });
                }

                async.parallel(unlinkObjects, callback);
            });
        };
    };

    var unlinkModels = [];

    linkedData.forEach(function(linkedItem) {
        unlinkModels.push(getUnlinker(linkedItem.model, linkedItem.field, linkedItem.unlink));
    });

    async.parallel(unlinkModels, function (err) {
        res.send(err ? {reason: err.toString()} : '');
    });
};

exports.getAssessmentsByID = function (req, res) {
    Assessment.findOne({assessment_ID: req.params.assessment_ID, deleted: {$ne: true}})
        .populate('researcher_ID', 'firstName lastName role email')
        .populate('reviewer_ID', 'firstName lastName role email')
        .populate('supervisor_ID', 'firstName lastName role email')
        .populate('ext_reviewer_ID', 'firstName lastName role email')
        .populate('last_modified.user', 'firstName lastName role email')
        .exec(function (err, assessment) {
            if(assessment === null) {
                err = 'The requested assessment is not found';
            }

            res.send(err ? {reason: err.toString()} : assessment);
        });
};

exports.createAssessments = function (req, res) {
    var new_assessments = req.body;
    //console.log(new_assessments);

    function createNewAssessment (new_assessment) {
        Assessment.create(new_assessment, function (err) {
            if (err) {
                if (err.toString().indexOf('E11000') > -1) {
                    err = new Error('Duplicate Assessment');
                }
                res.status(400);
                return res.send({reason: err.toString()});
            }
        });
    }

    for (var i = 0; i < new_assessments.length; i += 1) {
        createNewAssessment(new_assessments[i]);
    }
    res.send();
};

exports.updateAssessment = function (req, res, next) {
    var assessment_init = false,
        bySupervisorSubmitted = false,
        assessmentUpdates = req.body,
        timestamp = new Date().toISOString(),
        edit_control_id = assessmentUpdates.edit_control,
        researcher_id = assessmentUpdates.researcher_ID,
        reviewer_id = assessmentUpdates.reviewer_ID,
        contact_packet = {};

    contact_packet.assessment_title = assessmentUpdates.country + " " + assessmentUpdates.year + " " + assessmentUpdates.version;

    if (req.user.role === 'supervisor') {
        contact_packet.admin_name = req.user.firstName + " " + req.user.lastName;
        contact_packet.admin_email = req.user.email;
        bySupervisorSubmitted = true;
    }
    //TODO make sure i can res.send without breaking function
    contact_packet.admin = [];

    if (assessmentUpdates.supervisor_ID) {
        assessmentUpdates.supervisor_ID.forEach(function (sup) {
            contact_packet.admin.push({
                name: sup.firstName + ' ' + sup.lastName,
                email: sup.email
            });
        });
    }

    User.findOne({_id: researcher_id}).exec(function (err, user_researcher) {
        if (user_researcher) {
            contact_packet.researcher_firstName = user_researcher.firstName;
            contact_packet.researcher_lastName = user_researcher.lastName;
            contact_packet.researcher_fullName = user_researcher.firstName + " " + user_researcher.lastName;
            contact_packet.researcher_email = user_researcher.email;
        }

        User.findOne({_id: reviewer_id}).exec(function (err, user_reviewer) {
            if (user_reviewer) {
                contact_packet.reviewer_firstName = user_reviewer.firstName;
                contact_packet.reviewer_lastName = user_reviewer.lastName;
                contact_packet.reviewer_fullName = user_reviewer.firstName + " " + user_reviewer.lastName;
                contact_packet.reviewer_email = user_reviewer.email;
                contact_packet.reviewer_role = user_reviewer.role;
            }
            User.findOne({_id: edit_control_id}).exec(function (err, user_editor) {
                if (user_editor) {
                    contact_packet.editor_firstName = user_editor.firstName;
                    contact_packet.editor_lastName = user_editor.lastName;
                    contact_packet.editor_fullName = user_editor.firstName + " " + user_editor.lastName;
                    contact_packet.editor_role = user_editor.role;
                    contact_packet.editor_email = user_editor.email;
                }

                var updateAnswersStatuses = function(criteria, updateData) {
                    Answer.find(criteria).exec(function (err, answers) {
                        var promises = [];

                        answers.forEach(function (answer) {
                            Object.keys(updateData).forEach(function(field) {
                                answer[field] = updateData[field];
                            });

                            promises.push(function(callback) {new Answer(answer).save(callback);});
                        });

                        async.parallel(promises, function (err) {
                            if(err) {
                                res.sendStatus(500);
                                return next(err);
                            }
                        });
                    });
                };

                Assessment.findOne({_id: assessmentUpdates._id}).exec(function (err, assessment) {
                    if (assessment.status === 'unassigned') {
                        assessment_init = true;
                    }
                    if (err) {
                        res.sendStatus(400);
                        return res.send({ reason: err.toString() });
                    }
                    if (!(assessment.hasOwnProperty('researcher_ID'))) {
                        assessment.researcher_ID = assessmentUpdates.researcher_ID;
                    }
                    if (!(assessment.hasOwnProperty('reviewer_ID'))) {
                        assessment.reviewer_ID = assessmentUpdates.reviewer_ID;
                    }

                    if (!(assessment.hasOwnProperty('assignment'))) {
                        if (assessmentUpdates.hasOwnProperty('researcher_ID')) {
                            assessment.assignment = {assigned_by: req.user._id, assigned_date: timestamp};
                        }
                    }
                    switch (assessmentUpdates.status) {
                        case 'researcher_trial':
                            if (!assessment.hasOwnProperty('assignment_date')) {
                                assessment.assignment_date = {user: req.user._id, date: timestamp};
                            }
                            break;
                        case 'trial_started':
                            if (!assessment.hasOwnProperty('researcher_start_date') && assessment.status==='researcher_trial') {
                                assessment.researcher_start_date = {user: req.user._id, date: timestamp};
                            }
                            if (!assessment.hasOwnProperty('reviewer_start_date') && assessment.status==='reviewer_trial') {
                                assessment.reviewer_start_date = {user: req.user._id, date: timestamp};
                            }
                            break;
                        case 'submitted':
                            if (assessment.status==='researcher_started') {
                                assessment.researcher_submit_date = {user: req.user._id, date: timestamp};
                            }
                            if (assessment.status==='reviewer_started') {
                                assessment.reviewer_submit_date = {user: req.user._id, date: timestamp};
                            }
                            break;
                        case 'review_researcher':
                        case 'review_reviewer':
                            updateAnswersStatuses({assessment_ID: assessment.assessment_ID},
                                {modified: false});
                            assessment.last_review_date = {user: req.user._id, date: timestamp};
                            break;
                        case 'approved':
                            if (!assessment.hasOwnProperty('approval_date')) {
                                assessment.approval_date = {user: req.user._id, date: timestamp};
                            }
                            break;
                    }

                    _.each(assessmentUpdates.ext_reviewer_ID, function(new_reviewer) {
                        var new_ext_assignment = true;
                        _.each(assessment.ext_reviewer_ID, function(old_reviewer) {
                            if (new_reviewer==old_reviewer) {
                                new_ext_assignment = false;
                            }
                        });
                        if (new_ext_assignment===true) {
                            User.findOne({_id: new_reviewer}).exec(function (err, new_ext_reviewer) {

                                new_ext_reviewer.assessments.push({
                                    assessment_ID: assessment.assessment_ID,
                                    country_name: assessment.country
                                });
                                new_ext_reviewer.save(function (err) {
                                    if (err) {
                                        res.sendStatus(500);
                                        return next(err);
                                    }
                                });

                            });
                        }
                    });
                    _.each(assessmentUpdates.supervisor_ID, function(new_supervisor) {
                        var new_supervisor_assignment = true;
                        _.each(assessment.supervisor_ID, function(old_supervisor) {
                            if (new_supervisor==old_supervisor || new_supervisor._id==old_supervisor) {
                                new_supervisor_assignment = false;
                            }
                        });
                        if (new_supervisor_assignment===true) {
                            User.findOne({_id: new_supervisor}).exec(function (err, new_supervisor_assignment) {

                                new_supervisor_assignment.assessments.push({
                                    assessment_ID: assessment.assessment_ID,
                                    country_name: assessment.country
                                });
                                new_supervisor_assignment.save(function (err) {
                                    if (err) {
                                        res.sendStatus(500);
                                        return next(err);
                                    }
                                });

                            });
                        }
                    });

                    assessment.last_modified = {user: req.user._id, date: timestamp};

                    var updatedFieldsSet = [
                        'ext_reviewer_ID',
                        'supervisor_ID',
                        'viewer_ID',
                        'first_pass',
                        'edit_control',
                        'status',
                        'documents',
                        'interviewees',
                        'resubmitted'
                    ];

                    if(bySupervisorSubmitted) {
                        updatedFieldsSet.push('deleted');
                    }

                    updatedFieldsSet.forEach(function(field) {
                        assessment[field] = assessmentUpdates[field];
                    });

                    if(assessment.status!=='trial_continue') {
                        assessment.save(function (err) {
                            if (err) {
                                res.sendStatus(500);
                                return next(err.message);
                            } else {
                                //TODO deal with from email feature
                                ///////////////////////////////
                                // MAIL ROUTING
                                ///////////////////////////////
                                if (assessmentUpdates.mail === true) {
                                    switch (assessmentUpdates.status) {

                                        case 'assigned':
                                            contact.new_assessment_assignment(contact_packet, 'researcher');
                                            if (contact_packet.reviewer_role !== 'supervisor') {
                                                contact.new_assessment_assignment(contact_packet, 'reviewer');
                                            }
                                            break;

                                        //TODO Need to handle group emails
                                        case 'researcher_trial':
                                            if (assessment_init) {
                                                contact.new_assessment_assignment(contact_packet, 'researcher');
                                                if (contact_packet.reviewer_role !== 'supervisor') {
                                                    contact.new_assessment_assignment(contact_packet, 'reviewer');
                                                }
                                            } else {
                                                contact.trial_assessment_return(contact_packet);
                                                updateAnswersStatuses({assessment_ID: assessment.assessment_ID},
                                                    {modified: false});
                                            }
                                            break;
                                        case 'trial_submitted':
                                            contact.trial_assessment_submission(contact_packet);
                                            break;
                                        case 'trial_continue':
                                            updateAnswersStatuses({assessment_ID: assessment.assessment_ID},
                                                {modified: false});
                                            contact.trial_assessment_continue(contact_packet);
                                            break;
                                        case 'submitted':
                                        case 'resubmitted':
                                            contact.assessment_submission(contact_packet);
                                            break;

                                        case 'review_researcher':
                                        case 'review_reviewer':
                                            updateAnswersStatuses({assessment_ID: assessment.assessment_ID},
                                                {modified: false});
                                            contact.flag_review(contact_packet);
                                            break;

                                        case 'assigned_researcher':
                                        case 'assigned_reviewer':
                                            contact.assessment_reassignment(contact_packet);
                                            break;

                                        case 'external_review':
                                            logger.log('send over to external review email');
                                            break;

                                        case 'final_approval':
                                            logger.log('final approval email');
                                            break;

                                        default:
                                            logger.log('no email action');
                                            break;
                                    }
                                }
                                res.send();
                            }
                        });
                    } else {
                        assessment.status = 'assigned';
                        updateAnswersStatuses({assessment_ID: assessment.assessment_ID, question_trial: true},
                            {status: 'submitted'});
                        assessment.save(function (err) {
                            if (err) {
                                return res.sendStatus(500);
                            } else {
                                //TODO deal with from email feature
                                ///////////////////////////////
                                // MAIL ROUTING
                                ///////////////////////////////
                                if (assessmentUpdates.mail === true) {
                                    switch (assessmentUpdates.status) {

                                        case 'assigned':
                                            contact.new_assessment_assignment(contact_packet, 'researcher');
                                            if (contact_packet.reviewer_role !== 'supervisor') {
                                                contact.new_assessment_assignment(contact_packet, 'reviewer');
                                            }
                                            break;

                                        //TODO Need to handle group emails
                                        case 'researcher_trial':
                                            updateAnswersStatuses({assessment_ID: assessment.assessment_ID},
                                                {modified: false});
                                            contact.trial_assessment_return(contact_packet);
                                            break;
                                        case 'trial_submitted':
                                            contact.trial_assessment_submission(contact_packet);
                                            break;
                                        case 'trial_continue':
                                            updateAnswersStatuses({assessment_ID: assessment.assessment_ID},
                                                {modified: false});
                                            contact.trial_assessment_continue(contact_packet);
                                            break;
                                        case 'submitted':
                                        case 'resubmitted':
                                            contact.assessment_submission(contact_packet);
                                            break;

                                        case 'review_researcher':
                                        case 'review_reviewer':
                                            updateAnswersStatuses({assessment_ID: assessment.assessment_ID},
                                                {modified: false});
                                            contact.flag_review(contact_packet);
                                            break;

                                        case 'assigned_researcher':
                                        case 'assigned_reviewer':
                                            contact.assessment_reassignment(contact_packet);
                                            break;

                                        case 'external_review':
                                            logger.log('send over to external review email');
                                            break;

                                        case 'final_approval':
                                            logger.log('final approval email');
                                            break;

                                        default:
                                            logger.log('no email action');
                                            break;
                                    }
                                }
                                res.send();
                            }
                        });
                    }

                });
            });
        });
    });
};

exports.updateModificationDate = function(req, res, next) {
    if(!req.hasOwnProperty('assessment_ID') || !req.hasOwnProperty('last_modified')) {
        next();
    } else {
        Assessment.findOne({assessment_ID: req.assessment_ID}).exec(function (getAssessmentError, assessment) {
            if(getAssessmentError !== null) {
                req.error = getAssessmentError;
                next();
            } else {
                if(assessment === null) {
                    req.status(404);
                    next();
                } else {
                    assessment.last_modified = req.last_modified;

                    assessment.save(function (updateAssessmentError) {
                        if(updateAssessmentError !== null) {
                            req.error = updateAssessmentError;
                        }

                        next();
                    });
                }
            }
        });
    }
};
