'use strict';
/* global require */

var Answer      = require('mongoose').model('Answer'),
    Assessment  = require('mongoose').model('Assessment'),
    User        = require('mongoose').model('User'),
    _           = require('underscore'),
    contact     = require('../utilities/contact');

exports.getAssessments = function (req, res) {

    if (req.query.ext_reviewer_ID) {
        try {
            req.query.ext_reviewer_ID = JSON.parse(req.query.ext_reviewer_ID);
        } catch (e) {
            if (e instanceof SyntaxError) {
                req.query.ext_reviewer_ID = req.query.ext_reviewer_ID;
            }
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
        .exec(function (err, assessments) {
            if (err) { return next(err); }
            if (!assessments) { return next(new Error('No assessments found')); }
            res.send(assessments);
        });
};


exports.getAssessmentsByID = function (req, res) {
    Assessment.findOne({assessment_ID: req.params.assessment_ID})
        .populate('researcher_ID', 'firstName lastName role email')
        .populate('reviewer_ID', 'firstName lastName role email')
        .exec(function (err, assessment) {
            if (err) { return next(err); }
            res.send(assessment);
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

exports.updateAssessment = function (req, res) {
    var assessmentUpdates = req.body,
        timestamp = new Date().toISOString(),
        edit_control_id = assessmentUpdates.edit_control,
        researcher_id = assessmentUpdates.researcher_ID,
        reviewer_id = assessmentUpdates.reviewer_ID,
        contact_packet = {};

    contact_packet.assessment_title = assessmentUpdates.country + " " + assessmentUpdates.year + " " + assessmentUpdates.version;

    if (req.user.role === 'supervisor') {
        contact_packet.admin_name = req.user.firstName + " " + req.user.lastName;
        contact_packet.admin_email = req.user.email;
    }
    //TODO make sure i can res.send without breaking functino
    if (String(req.user._id) !== String(assessmentUpdates.researcher_ID._id) && String(req.user._id) !== String(assessmentUpdates.reviewer_ID._id) && !req.user.hasRole('supervisor')) {
        //var err = new Error('You are not an admin and do not have edit control!');
        res.sendStatus(404);
        return res.end();
        //return res.send({reason: err.toString()});
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

                Assessment.findOne({_id: assessmentUpdates._id}).exec(function (err, assessment) {
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
                            assessment.last_review_date = {user: req.user._id, date: timestamp};
                            break;
                        case 'approved':
                            if (!assessment.hasOwnProperty('approval_date')) {
                                assessment.approval_date = {user: req.user._id, date: timestamp};
                            }
                            break;
                    }

                    _.each(assessmentUpdates.ext_reviewer_ID, function(new_reviewer) {
                        var new_assignment = true;
                        _.each(assessment.ext_reviewer_ID, function(old_reviewer) {
                            if (new_reviewer==old_reviewer) {
                                new_assignment = false;
                            }
                        });
                        if (new_assignment===true) {
                            User.findOne({_id: new_reviewer}).exec(function (err, new_ext_reviewer) {

                                new_ext_reviewer.assessments.push({
                                    assessment_ID: assessment.assessment_ID,
                                    country_name: assessment.country
                                });
                                new_ext_reviewer.save(function (err) {
                                    if (err) {
                                        return res.send({ reason: err.toString() });
                                    }
                                });

                            });
                        }
                    });

                    assessment.ext_reviewer_ID = assessmentUpdates.ext_reviewer_ID;
                    assessment.first_pass = assessmentUpdates.first_pass;
                    assessment.edit_control = assessmentUpdates.edit_control;
                    assessment.status = assessmentUpdates.status;
                    assessment.documents = assessmentUpdates.documents;
                    assessment.interviewees = assessmentUpdates.interviewees;
                    assessment.last_modified = {user: req.user._id, date: timestamp};

                    if(assessment.status!=='trial_continue') {
                        assessment.save(function (err) {
                            if (err) {
                                return res.send({ reason: err.toString() });
                            }
                        });
                    } else {
                        assessment.status = 'assigned';
                        Answer.find({assessment_ID: assessment.assessment_ID, question_trial: true}).exec(function (err, answers) {
                            answers.forEach(function (answer) {
                                answer.status = 'submitted';
                                answer.save(function (err) {
                                    if (err) {
                                        res.send({ reason: err.toString() });
                                    }
                                });
                            });
                        });
                        assessment.save(function (err) {
                            if (err) {
                                return res.send({ reason: err.toString() });
                            }
                        });
                    }

                });
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
                        case 'researcher_trial':
                            contact.trial_assessment_return(contact_packet);
                            break;
                        case 'trial_submitted':
                            contact.trial_assessment_submission(contact_packet);
                            break;
                        case 'trial_continue':
                            contact.trial_assessment_continue(contact_packet);
                            break;
                        case 'submitted':
                        case 'resubmitted':
                            contact.assessment_submission(contact_packet);
                            break;

                        case 'review_researcher':
                        case 'review_reviewer':
                            contact.flag_review(contact_packet);
                            break;

                        case 'assigned_researcher':
                        case 'assigned_reviewer':
                            contact.assessment_reassignment(contact_packet);
                            break;

                        case 'external_review':
                            console.log('send over to external review email');
                            break;

                        case 'final_approval':
                            console.log('final approval email');
                            break;

                        default:
                            console.log('no email action');
                            break;
                    }
                }
            });
        });
    });

    res.send();
};
