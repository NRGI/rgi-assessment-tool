'use strict';

var config = require('../config/config')[process.env.NODE_ENV = process.env.NODE_ENV || 'development'],
    siteEmail = 'tech-support@resourcegovernance.org';

var mandrill = require('node-mandrill')(process.env.MANDRILL_APIKEY);

var sendMessage = function(message) {
        mandrill('/messages/send', {message: message}, processFailure);
    },
    processFailure = function (err, res) {
        console.log(err ? JSON.stringify(err) : res);
    };

// send email to tech support
exports.techSend = function (req, res) {
    var message_content = req.body,
        issue_tool = message_content.tool.toUpperCase(),
        issue_full_name = message_content.first_name + " " + message_content.last_name,
        supervisor_email = [{email: siteEmail, name: 'Assessment tool tech support'}];

    if (message_content.assessment) {
        message_content.assessment.supervisor_ID.forEach(function (supervisor) {
            supervisor_email.push({email: supervisor.email, name: supervisor.firstName + ' ' + supervisor.lastName});
        });
    }

    var issue_os = message_content.os || message_content.os_text || 'None supplied';
    var issue_browser = message_content.browser || message_content.browser_text || 'None supplied';
    var issue_browser_ver = message_content.browser_ver || 'None supplied';
    //send an e-mail to technical support
    sendMessage({
        to: supervisor_email,
        from_email: siteEmail,
        subject: issue_tool + ' Issue: ' + message_content.issue.value,
        html: "Hi,<p>" + "<a href='mailto:"+ message_content.email + "'>" + issue_full_name +
        "</a> is having an issue with the " + issue_tool + " tool. Please find more info below.<p>" +
        "<ul><li><b>Issue</b>: " + message_content.issue.name + "</li><<li><b>Issue description</b>: " +
        message_content.issue_description + "</li>" + "<li><b>OS</b>: " + issue_os + "</li><li><b>Browser</b>: " +
        issue_browser + "</li><li><b>Browser version</b>: " + issue_browser_ver + "</li></ul>"
    });

    //send a confirmation e-mail to user
    sendMessage({
        to: [{email: message_content.email, name: issue_full_name}],
        from_email: siteEmail,
        subject: 'Confirmation of ' + message_content.issue.value + ' support ticket',
        html: "Hi " + issue_full_name + ",<p>" + "Thanks for contacting us about an issue with the " + issue_tool +
        "tool. I'm sorry for the inconvenience, we will contact you shortly. " +
        "In the meantime please look at the info you supplied below and let us know if any of it is incorrect.<p>" +
        "<ul><li><b>Issue</b>: " + message_content.issue.name + "</li><<li><b>Issue description</b>: " +
        message_content.issue_description + "</li>" + "<li><b>OS</b>: " + issue_os + "</li><li><b>Browser</b>: " +
        issue_browser + "</li><li><b>Browser version</b>: " + issue_browser_ver + "</li></ul>"
    });

    res.send();
};

/////////////////////////////////
///////USER RECORD EMAILS////////
/////////////////////////////////

// send email to new user
exports.new_user_confirmation = function (contact_packet, token) {
    sendMessage({
        to: [{email: contact_packet.rec_email, name: contact_packet.rec_name}],
        from_email: siteEmail,
        subject: contact_packet.rec_role + ' account created!',
        html: 'Hello ' + contact_packet.rec_name + ',<p>' + 'an RGI ' + contact_packet.rec_role +
        ' account was just set up for you by <a href="' + contact_packet.send_email + '">' + contact_packet.send_name +
        '</a>.<p>' + 'The user name is <b>' + contact_packet.rec_username + '</b>. ' + 'Please, <a href="' +
        config.baseUrl + '/reset-password/' + token + '">set up your password</a> before logging in.<p>' +
        'Thanks!<p>' + 'The RGI Team.'
    });
};

exports.reset_password_confirmation = function (user, token) {
    var fullName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + " " +
        user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);
    sendMessage({
        to: [{email: user.email, name: fullName}],
        from_email: siteEmail,
        subject: 'Password Recovery',
        html: 'Hello ' + fullName + ',<p>' + 'Please, <a href="' + config.baseUrl + '/reset-password/' + token +
        '">click here</a> to recover your password.<p>' + 'Thanks!<p>' + 'The RGI Team.'
    });
};
//TODO delete user confirmation
exports.delete_user_confirmation = function (contact_packet) {

};

////////////////////////////////////////
///////ASSESSMENT RECORD EMAILS////////
////////////////////////////////////////

// email when assessment is assigned
exports.new_assessment_assignment = function (contact_packet, type) {
    sendMessage({
        to: [{email: contact_packet[type + '_email'], name: contact_packet[type + '_fullName']}],
        from_email: contact_packet.admin[0].email,
        subject: contact_packet.assessment_title + ' assessment assigned!',
        html: "Hello " + contact_packet[type + '_firstName'] + ",<p>" + "<a href='" + contact_packet.admin[0].email +
        "'>" + contact_packet.admin[0].name + "</a> just assigned the " + contact_packet.assessment_title +
        " assessement to you.<p>" + "Please visit your <a href='" + config.baseUrl +
        "/admin/assessment-admin'>assessment dashboard</a> to start the assessment.<p>" + "Thanks!<p>" + "The RGI Team."
    });
};

// email when trial assessment is submitted or resubmitted
exports.trial_assessment_submission = function (emailData) {
    //send an email to team that assessment is ready
    sendMessage({
        to: emailData.admin,
        from_email: siteEmail,
        subject: emailData.assessment_title + ' submitted by ' + emailData.editor_role + " " + emailData.editor_fullName,
        html: "Hi team,<p>" + "<a href='" + emailData.editor_email + "'>" + emailData.editor_fullName +
        "</a> just submitted the " + emailData.assessment_title + " trial assessment for review. " +
        "Please visit your <a href='" + config.baseUrl +
        "/admin/assessment-admin'>assessment dashboard</a> to review.<p>" + "Thanks!<p>" + "The RGI Team.<p>"
    });
    //send email to submitter that it went through
    sendMessage({
        to: [{email: emailData.editor_email, name: emailData.editor_fullName}],
        from_email: emailData.admin[0].email,
        subject: emailData.assessment_title + " recieved.",
        html: "Hi "+ emailData.editor_fullName + ",<p>" + "Your submission of the " + emailData.assessment_title +
        " trial assessment was sent to the admin team. We will be in contact shortly with next steps. " +
        "Please visit your <a href='" + config.baseUrl +
        "/admin/assessment-admin'>assessment dashboard</a> if you want to check the status.<p>" +
        "Thanks!<p>" + "The RGI Team.<p>"
    });
};

// email when assessment is submitted or resubmitted
exports.assessment_submission = function (emailData) {
    //send an email to team that assessment is ready
    sendMessage({
        to: emailData.admin,
        from_email: siteEmail,
        subject: emailData.assessment_title + ' submitted by ' + emailData.editor_role + " " + emailData.editor_fullName,
        html: "Hi team,<p>" + "<a href='" + emailData.editor_email + "'>" + emailData.editor_fullName +
        "</a> just submitted the " + emailData.assessment_title + " assessment for review." +
        "Please visit your <a href='" + config.baseUrl +
        "/admin/assessment-admin'>assessment dashboard</a> to review.<p>" + "Thanks!<p>" + "The RGI Team.<p>"
    });
    //send email to submitter that it went through
    sendMessage({
        to: [{email: emailData.editor_email, name: emailData.editor_fullName}],
        from_email: emailData.admin[0].email,
        subject: emailData.assessment_title + " recieved.",
        html: "Hi "+ emailData.editor_fullName + ",<p>" + "Your submission of the " + emailData.assessment_title +
        " assessment was sent to the admin team. We will be in contact shortly with next steps." +
        "Please visit your <a href='" + config.baseUrl +
        "/admin/assessment-admin'>assessment dashboard</a> if you want to check the status.<p>" +
        "Thanks!<p>" + "The RGI Team.<p>"
    });
};

// email when trial answers need to be reviewed by researcher or reviewer
exports.trial_assessment_return = function (contact_packet) {
    sendMessage({
        to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
        from_email: contact_packet.admin[0].email,
        subject: contact_packet.assessment_title + ' assessment returned for review!',
        html: "Hello " + contact_packet.editor_firstName + ",<p>" + "<a href='" + contact_packet.admin[0].email + "'>" +
        contact_packet.admin[0].name + "</a> just returned the " + contact_packet.assessment_title +
        " trial assessement to you. " +
        "There are a few errors we'd like you to address before moving the assessment on.<p>" +
        "Please go to your <a href='" + config.baseUrl +
        "/assessments'>assessment dashboard</a> to take a look at flagged answers in the assessment.<p>" +
        "Thanks!<p>" + "The RGI Team."
    });
};

// email when flags need to be reviewed by researcher or reviewer
exports.flag_review = function (contact_packet) {
    sendMessage({
        to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
        from_email: contact_packet.admin[0].email,
        subject: contact_packet.assessment_title + ' assessment returned for review!',
        html: "Hello " + contact_packet.editor_firstName + ",<p>" + "<a href='" + contact_packet.admin[0].email + "'>" +
        contact_packet.admin[0].name + "</a> just returned the " + contact_packet.assessment_title +
        " assessement to you. " +
        "There are a few errors we'd like you to address before moving the assessment on.<p>" +
        "Please go to your <a href='" + config.baseUrl +
        "/assessments'>assessment dashboard</a> to take a look at flagged answers in the assessment.<p>" +
        "Thanks!<p>" + "The RGI Team."
    });
};

// email when reassigning to researcher or reviewer
exports.assessment_reassignment = function (contact_packet) {
    sendMessage({
        to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
        from_email: contact_packet.admin[0].email,
        subject: "Please begin work on the " + contact_packet.assessment_title + " assessment!",
        html: "Hello " + contact_packet.editor_firstName + ",<p>" + "<a href='" + contact_packet.admin[0].email + "'>" +
        contact_packet.admin[0].name + "</a> just returned the " + contact_packet.assessment_title +
        " assessement to your control.<p>" + "Please go to your <a href='" + config.baseUrl +
        "/admin/assessment-admin'>assessment dashboard</a>.<p>" + "Thanks!<p>" + "The RGI Team."
    });
};

// email when reassigning to researcher or reviewer
exports.trial_assessment_continue = function (contact_packet) {
    sendMessage({
        to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
        from_email: contact_packet.admin[0].email,
        subject: "Please continue work on the " + contact_packet.assessment_title + " assessment!",
        html: "Hello " + contact_packet.editor_firstName + ",<p>" + "<a href='" + contact_packet.admin[0].email + "'>" +
        contact_packet.admin[0].name + "</a> just approved your initial answers on the " +
        contact_packet.assessment_title + " assessement.<p>" + "Please go to your <a href='" + config.baseUrl +
        "/admin/assessment-admin'>assessment dashboard</a> to continue.<p>" + "Thanks!<p>" + "The RGI Team."
    });
};
