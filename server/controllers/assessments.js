'use strict';
/*jslint nomen: true unparam: true*/

var Assessment = require('mongoose').model('Assessment'),
    User = require('mongoose').model('User'),
    mandrill = require('node-mandrill')(process.env.MANDRILL_APIKEY);

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
    var new_assessments, i;

    new_assessments = req.body;

    for (i = 0; i < new_assessments.length; i += 1) {
        Assessment.create(new_assessments[i], function (err, assessment) {
            if (err) {
                res.status(400);
                return res.send({reason: err.toString()});
            }
        });
    }
    res.send();
};

exports.updateAssessment = function (req, res) {
    var assessmentUpdates = req.body,
        timestamp = new Date().toISOString(),
        admin_name = req.user.firstName + " " + req.user.lastName,
        admin_email = req.user.email,
        edit_control_id = assessmentUpdates.edit_control,
        researcher_id = assessmentUpdates.researcher_ID,
        reviewer_id = assessmentUpdates.reviewer_ID,
        assessment_title = assessmentUpdates.country + " " + assessmentUpdates.year + " " + assessmentUpdates.version;


    User.findOne({_id: researcher_id}).exec(function (err, user_researcher) {
        var researcher_firstName = user_researcher.firstName,
            researcher_lastName = user_researcher.lastName,
            researcher_fullName = user_researcher.firstName + " " + user_researcher.lastName,
            researcher_email = user_researcher.email;

        User.findOne({_id: reviewer_id}).exec(function (err, user_reviewer) {
            var reviewer_firstName = user_reviewer.firstName,
                reviewer_lastName = user_reviewer.lastName,
                reviewer_fullName = user_reviewer.firstName + " " + user_reviewer.lastName,
                reviewer_email = user_reviewer.email;

            User.findOne({_id: edit_control_id}).exec(function (err, user_editor) {
                var editor_firstName = user_editor.firstName,
                    editor_lastName = user_editor.lastName,
                    editor_fullName = user_editor.firstName + " " + user_editor.lastName,
                    editor_email = user_editor.email;

                if (String(req.user._id) !== String(assessmentUpdates.researcher_ID) && String(req.user._id) !== String(assessmentUpdates.reviewer_ID) && !req.user.hasRole('supervisor')) {
                    res.sendStatus(404);
                    return res.end();
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
                        assessment.assignment = {assigned_by: req.user._id, assigned_date: timestamp};
                    }

                    if (assessmentUpdates.hasOwnProperty('start_date')) {
                        if (!(assessment.hasOwnProperty('start_date'))) {
                            assessment.start_date = {started_by: assessmentUpdates.start_date.started_by, started_date: timestamp};
                        }
                    }
                    if (assessmentUpdates.hasOwnProperty('submit_date')) {
                        if (!(assessment.hasOwnProperty('submit_date'))) {
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

                    assessment.questions_complete = assessmentUpdates.questions_complete;
                    assessment.edit_control = assessmentUpdates.edit_control;
                    assessment.status = assessmentUpdates.status;

                    if (assessment.modified) {
                        assessment.modified.push({modified_by: req.user._id, modified_date: timestamp});
                    } else {
                        assessment.modified = [{modified_by: req.user._id, modified_date: timestamp}];
                    }

                    assessment.save(function (err) {
                        if (err) {
                            return res.send({ reason: err.toString() });
                        }
                    });
                });
                ///////////////////////////////
                // MAIL OPTIONS
                ///////////////////////////////
                // assignment flow
                if (assessmentUpdates.status === 'assigned') {
                    // //send an researcher notification e-mail
                    // mandrill('/messages/send', {
                    //     message: {
                    //         to: [{email: researcher_email, name: researcher_fullName}],
                    //         from_email: 'rgi-admin@resourcegovernance.org',
                    //         subject: assessment_title + ' assessment assigned!',
                    //         html: "Hello " + researcher_firstName + ",<p>\
                    //                <a href='" + admin_email + "'>" + admin_name + "</a> just assigned the " + assessment_title + " assessement to you.<p>\
                    //                Please go to your <a href='http://rgiassessmenttool.elasticbeanstalk.com/assessments'>assessment dashboard</a> to start the assessment.<p>\
                    //                Thanks!<p>\
                    //                The RGI Team."

                    //                // "an RGI " + rec_role + "account was just set up for you by <a href='" + req.user.email + "'>" + send_name + "</a>.<p>\
                    //                // The user name is <b>" + rec_username + "</b> and the password is <b>" + rec_password + "</b>.\
                    //                // Please login <a href='http://rgiassessmenttool.elasticbeanstalk.com'>here</a>.<p>\
                    //                // Thanks!<p>\
                    //                // The RGI Team."
                    //     }
                    // }, function (error, response) {
                    //     //uh oh, there was an error
                    //     if (error) console.log( JSON.stringify(error) );

                    //     //everything's good, lets see what mandrill said
                    //     else console.log(response);
                    // });
                    // //send an reviewr notification e-mail
                    // mandrill('/messages/send', {
                    //     message: {
                    //         to: [{email: reviewer_email, name: reviewer_fullName}],
                    //         from_email: 'rgi-admin@resourcegovernance.org',
                    //         subject: assessment_title + ' assessment assigned!',
                    //         html: "Hello " + reviewer_firstName + ",<p>\
                    //                <a href='" + admin_email + "'>" + admin_name + "</a> just assigned the " + assessment_title + " assessement to you.<p>\
                    //                Please hold tight while the researcher completes the initial assessment.<p>\
                    //                Once that is complete you will be notified that it is time to review.<p>\
                    //                Thanks!<p>\
                    //                The RGI Team."

                    //                // "an RGI " + rec_role + "account was just set up for you by <a href='" + req.user.email + "'>" + send_name + "</a>.<p>\
                    //                // The user name is <b>" + rec_username + "</b> and the password is <b>" + rec_password + "</b>.\
                    //                // Please login <a href='http://rgiassessmenttool.elasticbeanstalk.com'>here</a>.<p>\
                    //                // Thanks!<p>\
                    //                // The RGI Team."
                    //     }
                    // }, function (error, response) {
                    //     //uh oh, there was an error
                    //     if (error) console.log( JSON.stringify(error) );

                    //     //everything's good, lets see what mandrill said
                    //     else console.log(response);
                    // });
                // assignment flow
                } else if (assessmentUpdates.status === 'submitted') {

                }

            });
        });
    });

    res.send();
};