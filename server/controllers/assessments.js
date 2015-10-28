'use strict';
/* global require */

var Assessment  = require('mongoose').model('Assessment'),
    User        = require('mongoose').model('User'),
    contact     = require('../utilities/contact');

exports.getAssessments = function (req, res) {
    var query = Assessment.find(req.query);
    query.exec(function (err, collection) {
        res.send(collection);
    });
};


exports.getAssessmentsByID = function (req, res) {
    Assessment.findOne({assessment_ID: req.params.assessment_ID}).exec(function (err, assessment) {
        res.send(assessment);
    });
};

exports.createAssessments = function (req, res, next) {
    var new_assessments = req.body;

    function createNewAssessment (new_assessment) {
        Assessment.create(new_assessment, function (err, assessment) {
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
    if (String(req.user._id) !== String(assessmentUpdates.researcher_ID) && String(req.user._id) !== String(assessmentUpdates.reviewer_ID) && !req.user.hasRole('supervisor')) {
        //var err = new Error('You are not an admin and do not have edit control!');
        res.sendStatus(404);
        return res.end();
        //return res.send({reason: err.toString()});
    }

    User.findOne({_id: researcher_id}).exec(function (err, user_researcher) {
        contact_packet.researcher_firstName = user_researcher.firstName;
        contact_packet.researcher_lastName = user_researcher.lastName;
        contact_packet.researcher_fullName = user_researcher.firstName + " " + user_researcher.lastName;
        contact_packet.researcher_email = user_researcher.email;

        User.findOne({_id: reviewer_id}).exec(function (err, user_reviewer) {
            if (user_reviewer) {
                contact_packet.reviewer_firstName = user_reviewer.firstName;
                contact_packet.reviewer_lastName = user_reviewer.lastName;
                contact_packet.reviewer_fullName = user_reviewer.firstName + " " + user_reviewer.lastName;
                contact_packet.reviewer_email = user_reviewer.email;
                contact_packet.reviewer_role = user_reviewer.role;
            }
            User.findOne({_id: edit_control_id}).exec(function (err, user_editor) {
                contact_packet.editor_firstName = user_editor.firstName;
                contact_packet.editor_lastName = user_editor.lastName;
                contact_packet.editor_fullName = user_editor.firstName + " " + user_editor.lastName;
                contact_packet.editor_role = user_editor.role;
                contact_packet.editor_email = user_editor.email;

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
                        assessment.assignment = {assigned_by: req.user._id, assigned_date: timestamp};
                    }

                    if (!(assessment.hasOwnProperty('start_date'))) {
                        if (assessmentUpdates.hasOwnProperty('start_date')) {
                            assessment.start_date = {started_by: assessmentUpdates.start_date.started_by, started_date: timestamp};
                        }
                    }

                    if (!(assessment.hasOwnProperty('submit_date'))) {
                        if (assessmentUpdates.hasOwnProperty('submit_date')) {
                            assessment.submit_date = {submited_by: assessmentUpdates.submit_date.submited_by, submited_date: timestamp};
                        }
                    }

                    if (assessmentUpdates.hasOwnProperty('review_date')) {
                        if (!(assessment.hasOwnProperty('review_date'))) {
                            assessment.review_date = {reviewed_by: assessmentUpdates.review_date.reviewed_by, reviewed_date: timestamp};
                        }
                    }
                    if (assessmentUpdates.hasOwnProperty('approval')) {
                        if (!(assessment.hasOwnProperty('approval'))) {
                            assessment.approval = {approved_by: assessmentUpdates.approval.approved_by, approved_date: timestamp};
                        }
                    }

                    assessment.edit_control = assessmentUpdates.edit_control;
                    assessment.status = assessmentUpdates.status;
                    assessment.documents = assessmentUpdates.documents;
                    assessment.interviewees = assessmentUpdates.interviewees;
                    assessment.last_modified = {modified_by: req.user._id, modified_date: timestamp};

                    assessment.save(function (err) {
                        if (err) {
                            return res.send({ reason: err.toString() });
                        }
                    });
                });
                //TODO refator this into ./server/utiliies/contact.js
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
                        case 'submitted':
                        case 'resubmitted':
                            contact.assessment_submission(contact_packet, 'researcher');
                            break;

                        case 'review_researcher':
                        case 'review_reviewer':
                            contact.flag_review(contact_packet);
                            break;

                        case 'assigned_researcher':
                        case 'assigned_reviewer':
                            contact.assessment_reassignment(contact_packet);
                            break;

                        case 'internal_review':
                            console.log('send over to internal review email');
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
