'use strict';

var config = require('../config/config')[process.env.NODE_ENV = process.env.NODE_ENV || 'development'],
    siteEmail = 'tech-support@resourcegovernance.org';

var mandrill = require('node-mandrill')(process.env.MANDRILL_APIKEY);
// send email to tech support
exports.techSend = function (req, res) {
    var issue_os, issue_browser, issue_browser_ver,
        message_content = req.body,
        issue_tool = message_content.tool.toUpperCase(),
        issue_full_name = message_content.first_name + " " + message_content.last_name;
        //issue_first_name = message_content.first_name,
        //issue_last_name = message_content.last_name,
    if (message_content.os) {
        issue_os = message_content.os;
    } else {
        if(message_content.os_text) {
            issue_os = message_content.os_text;
        } else {
            issue_os = 'None supplied';
        }
    }
    if (message_content.browser) {
        issue_browser = message_content.browser;
    } else {
        if(message_content.browser_text) {
            issue_browser = message_content.browser_text;
        } else {
            issue_browser = 'None supplied';
        }
    }
    if (message_content.browser_ver) {
        issue_browser_ver = message_content.browser_ver;
    } else {
        issue_browser_ver = 'None supplied';
    }
    //send an e-mail to technical support
    mandrill('/messages/send', {
        message: {
            to: [{email: siteEmail, name: 'Assessment tool tech support'}],
            from_email: message_content.email,
            subject: issue_tool + ' Issue: ' + message_content.issue.value,
            html: "Hi,<p>" +
            issue_full_name + " is having an issue with the " + issue_tool + " tool. Please find more info below.<p>" +
            "<ul><li><b>Issue</b>: " + message_content.issue.name + "</li><<li><b>Issue description</b>: " + message_content.issue_description + "</li>" +
            "<li><b>OS</b>: " + issue_os + "</li><li><b>Browser</b>: " + issue_browser + "</li><li><b>Browser version</b>: " + issue_browser_ver + "</li></ul>"
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });

    //send a confirmation e-mail to user
    mandrill('/messages/send', {
        message: {
            to: [{email: message_content.email, name: issue_full_name}],
            from_email: 'tech-support@resourcegovernance.org',
            subject: 'Confirmation of ' + message_content.issue.value + ' support ticket',
            html: "Hi " + issue_full_name + "\,<p>" +
            "Thanks for contacting us about an issue with the " + issue_tool + "tool. I'm sorry for the inconvenience\, we will contact you shortly. " +
            "In the meantime please look at the info you supplied below and let us know if any of it is incorrect.<p>" +
            "<ul><li><b>Issue</b>: " + message_content.issue.name + "</li><<li><b>Issue description</b>: " + message_content.issue_description + "</li>" +
            "<li><b>OS</b>: " + issue_os + "</li><li><b>Browser</b>: " + issue_browser + "</li><li><b>Browser version</b>: " + issue_browser_ver + "</li></ul>"
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
    res.send();
};

/////////////////////////////////
///////USER RECORD EMAILS////////
/////////////////////////////////

// send email to new user
exports.new_user_confirmation = function (contact_packet, token) {
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet.rec_email, name: contact_packet.rec_name}],
            from_email: contact_packet.send_email,
            subject: contact_packet.rec_role + ' account created!',
            html: 'Hello ' + contact_packet.rec_name + ',<p>' +
            'an RGI ' + contact_packet.rec_role + ' account was just set up for you by <a href="' +
            contact_packet.send_email + '">' + contact_packet.send_name + '</a>.<p>' +
            'The user name is <b>' + contact_packet.rec_username + '</b>. ' +
            'Please, <a href="' + config.baseUrl + '/reset-password/' + token + '">set up your password</a> before logging in.<p>' +
            'Thanks!<p>' +
            'The RGI Team.'
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};

exports.reset_password_confirmation = function (user, token) {
    var fullName = user.firstName.charAt(0).toUpperCase() +
        user.firstName.slice(1) + " " +
        user.lastName.charAt(0).toUpperCase() +
        user.lastName.slice(1);
    mandrill('/messages/send', {
        message: {
            to: [{email: user.email, name: fullName}],
            from_email: siteEmail,
            subject: 'Password Recovery',
            html: 'Hello ' + fullName + ',<p>' +
            'Please, <a href="' + config.baseUrl + '/reset-password/' + token + '">click here</a> to recover your password.<p>' +
            'Thanks!<p>' +
            'The RGI Team.'
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
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
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet[type + '_email'], name: contact_packet[type + '_fullName']}],
            from_email: contact_packet.admin[0],
            subject: contact_packet.assessment_title + ' assessment assigned!',
            html: "Hello " + contact_packet[type + '_firstName'] + ",<p>" +
            "<a href='" + contact_packet.admin[0].email + "'>" + contact_packet.admin[0].name + "</a> just assigned the " + contact_packet.assessment_title + " assessement to you.<p>" +
            "Please visit your <a href='" + config.baseUrl + "/admin/assessment-admin'>assessment dashboard</a> to start the assessment.<p>" +
            "Thanks!<p>" +
            "The RGI Team."
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};

// email when assessment is submitted or resubmitted
exports.trial_assessment_submission = function (contact_packet) {
    //send an email to team that assessment is ready
    mandrill('/messages/send', {
        message: {
            to: contact_packet.admin,
            from_email: contact_packet.editor_email,
            subject: contact_packet.assessment_title + ' submitted by ' + contact_packet.editor_role + " " + contact_packet.editor_fullName,
            html: "Hi team,<p>" +
            contact_packet.editor_fullName + " just submitted the " + contact_packet.assessment_title + " trial assessment for review. " +
            "Please visit your <a href='" + config.baseUrl + "/admin/assessment-admin'>assessment dashboard</a> to review.<p>" +
            "Thanks!<p>" +
            "The RGI Team.<p>"
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
    //send email to submitter that it went through
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
            from_email: contact_packet.admin[0],
            subject: contact_packet.assessment_title + " recieved.",
            html: "Hi "+ contact_packet.editor_fullName + ",<p>" +
            "Your submission of the " + contact_packet.assessment_title + " trial assessment was sent to the admin team. We will be in contact shortly with next steps. " +
            "Please visit your <a href='" + config.baseUrl + "/admin/assessment-admin'>assessment dashboard</a> if you want to check the status.<p>" +
            "Thanks!<p>" +
            "The RGI Team.<p>"
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};

// email when assessment is submitted or resubmitted
exports.assessment_submission = function (contact_packet) {
    //send an email to team that assessment is ready
    mandrill('/messages/send', {
        message: {
            to: contact_packet.admin,
            from_email: contact_packet.editor_email,
            subject: contact_packet.assessment_title + ' submitted by ' + contact_packet.editor_role + " " + contact_packet.editor_fullName,
            html: "Hi team,<p>" +
            contact_packet.editor_fullName + " just submitted the " + contact_packet.assessment_title + " assessment for review." +
            "Please visit your <a href='" + config.baseUrl + "/admin/assessment-admin'>assessment dashboard</a> to review.<p>" +
            "Thanks!<p>" +
            "The RGI Team.<p>"
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
    //send email to submitter that it went through
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
            from_email: contact_packet.admin[0],
            subject: contact_packet.assessment_title + " recieved.",
            html: "Hi "+ contact_packet.editor_fullName + ",<p>" +
            "Your submission of the " + contact_packet.assessment_title + " assessment was sent to the admin team. We will be in contact shortly with next steps." +
            "Please visit your <a href='" + config.baseUrl + "/admin/assessment-admin'>assessment dashboard</a> if you want to check the status.<p>" +
            "Thanks!<p>" +
            "The RGI Team.<p>"
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};

// email when trial answers need to be reviewed by researcher or reviewer
exports.trial_assessment_return = function (contact_packet) {
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
            from_email: contact_packet.admin,
            subject: contact_packet.assessment_title + ' assessment returned for review!',
            html: "Hello " + contact_packet.editor_firstName + ",<p>" +
            "<a href='" + contact_packet.admin[0].email + "'>" + contact_packet.admin[0].name + "</a> just returned the " + contact_packet.assessment_title + " trial assessement to you. " +
            "There are a few errors we'd like you to address before moving the assessment on.<p>" +
            "Please go to your <a href='" + config.baseUrl + "/assessments'>assessment dashboard</a> to take a look at flagged answers in the assessment.<p>" +
            "Thanks!<p>" +
            "The RGI Team."
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};

// email when flags need to be reviewed by researcher or reviewer
exports.flag_review = function (contact_packet) {
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
            from_email: contact_packet.admin,
            subject: contact_packet.assessment_title + ' assessment returned for review!',
            html: "Hello " + contact_packet.editor_firstName + ",<p>" +
            "<a href='" + contact_packet.admin[0].email + "'>" + contact_packet.admin[0].name + "</a> just returned the " + contact_packet.assessment_title + " assessement to you. " +
            "There are a few errors we'd like you to address before moving the assessment on.<p>" +
            "Please go to your <a href='" + config.baseUrl + "/assessments'>assessment dashboard</a> to take a look at flagged answers in the assessment.<p>" +
            "Thanks!<p>" +
            "The RGI Team."
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};

// email when reassigning to researcher or reviewer
exports.assessment_reassignment = function (contact_packet) {
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
            from_email: contact_packet.admin,
            subject: "Please begin work on the " + contact_packet.assessment_title + " assessment!",
            html: "Hello " + contact_packet.editor_firstName + ",<p>" +
            "<a href='" + contact_packet.admin[0].email + "'>" + contact_packet.admin[0].name + "</a> just returned the " + contact_packet.assessment_title + " assessement to your control.<p>" +
            "Please go to your <a href='" + config.baseUrl + "/admin/assessment-admin'>assessment dashboard</a>.<p>" +
            "Thanks!<p>" +
            "The RGI Team."
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};

// email when reassigning to researcher or reviewer
exports.trial_assessment_continue = function (contact_packet) {
    mandrill('/messages/send', {
        message: {
            to: [{email: contact_packet.editor_email, name: contact_packet.editor_fullName}],
            from_email: contact_packet.admin,
            subject: "Please continue work on the " + contact_packet.assessment_title + " assessment!",
            html: "Hello " + contact_packet.editor_firstName + ",<p>" +
            "<a href='" + contact_packet.admin[0].email + "'>" + contact_packet.admin[0].name + "</a> just approved your initial answers on the " + contact_packet.assessment_title + " assessement.<p>" +
            "Please go to your <a href='" + config.baseUrl + "/admin/assessment-admin'>assessment dashboard</a> to continue.<p>" +
            "Thanks!<p>" +
            "The RGI Team."
        }
    }, function (err, res) {
        if (err) { console.log( JSON.stringify(err) ); }
        else { console.log(res); }
    });
};


//// email when
//exports. = function (contact_packet) {
//    mandrill('/messages/send', {
//        message: {
//            to: [{email: , name: }],
//            from_email: [{email: , name: }],
//            subject: ,
//            html: ""
//        }
//    }, function (err, res) {
//        if (err) console.log( JSON.stringify(err) );
//        else console.log(res);
//    });
//};
