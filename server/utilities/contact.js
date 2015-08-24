'use strict'
var mandrill = require('node-mandrill')(process.env.MANDRILL_APIKEY);

exports.tech_send = function (req, res) {
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
            to: [{email: 'tech-support@resourcegovernance.org', name: 'Assessment tool tech support'}],
            from_email: message_content.email,
            subject: issue_tool + ' Issue: ' + message_content.issue.value,
            html: "Hi,<p>"
            + issue_full_name + " is having an issue with the " + issue_tool + " tool. Please find more info below.<p>"
            + "<ul><li><b>Issue</b>: " + message_content.issue.name + "</li><<li><b>Issue description</b>: " + message_content.issue_description + "</li>"
            + "<li><b>OS</b>: " + issue_os + "</li><li><b>Browser</b>: " + issue_browser + "</li><li><b>Browser version</b>: " + issue_browser_ver + "</li></ul>"
        }
    }, function (error, response) {
        //uh oh, there was an error
        if (error) console.log( JSON.stringify(error) );

        //everything's good, lets see what mandrill said
        else console.log(response);
    });
    res.send();
};

//exports.new_user = function (req, res, next) {
//
//    // send email to new user
//    mandrill('/messages/send', {
//        message: {
//            to: [{email: rec_email, name: rec_name}],
//            from_email: 'cperry@resourcegovernance.org',
//            subject: rec_role + ' account created!',
//            html: "Hello " + rec_name + ",<p>\
//                   an RGI " + rec_role + "account was just set up for you by <a href='" + req.user.email + "'>" + send_name + "</a>.<p>\
//                   The user name is <b>" + rec_username + "</b> and the password is <b>" + rec_password + "</b>.\
//                   Please login <a href='http://rgiassessmenttool.elasticbeanstalk.com'>here</a>.<p>\
//                   Thanks!<p>\
//                   The RGI Team."
//        }
//    }, function (error, response) {
//        //uh oh, there was an error
//        if (error) console.log( JSON.stringify(error) );
//
//        //everything's good, lets see what mandrill said
//        else console.log(response);
//    });
//
//}
