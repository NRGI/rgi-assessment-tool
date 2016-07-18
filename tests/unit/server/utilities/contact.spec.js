'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');
var contact = rewire(utils.getUtilityPath('contact'));

describe('`contact` utility', function() {
    var contactPacket = {}, CONFIG = {}, spies = {}, mandrill = {}, siteEmail,
        checkEmailBody = function(expectedBody, messageIndex) {
            expect(mandrill.messages[messageIndex || 0].html).to.equal(expectedBody);
        },
        checkEmailRecipient = function(email, name, messageIndex) {
            expect(mandrill.messages[messageIndex || 0].to).to.deep.equal([{email: email, name: name}]);
        },
        checkEmailSender = function(email, messageIndex) {
            expect(mandrill.messages[messageIndex || 0].from_email).to.equal(email);
        },
        checkEmailSubject = function(subject, messageIndex) {
            expect(mandrill.messages[messageIndex || 0].subject).to.equal(subject);
        };

    beforeEach(function() {
        mandrill = {messages: []};

        spies.mandrill = sinon.spy(function(path, options) {
            mandrill.path = path;
            mandrill.messages.push(options.message);
        });

        CONFIG.baseUrl = 'base URL';

        utils.setModuleLocalVariable(contact, 'config', CONFIG);
        utils.setModuleLocalVariable(contact, 'mandrill', spies.mandrill);
        siteEmail = utils.getModuleLocalVariable(contact, 'siteEmail');
    });

    describe('GENERAL EMAILS', function() {
        describe('#techSend', function() {
            var BODY, EMAIL = 'name@mail.com', FIRST_NAME = 'Name', LAST_NAME = 'Surname', TOOL = 'nrgi',
                ISSUE_VALUE = 'issue value', ISSUE_NAME = 'issue name', ISSUE_DESCRIPTION = 'issue description',
                SUPERVISOR_EMAIL = 'supervisor@mail.com', SUPERVISOR_FIRST_NAME = 'supervisor name',
                SUPERVISOR_LAST_NAME = 'supervisor surname', specialFields = {},
                checkEmails = function(os, browser, browserVersion) {
                    checkEmailBody("Hi,<p>" + "<a href='mailto:"+ EMAIL + "'>" + FIRST_NAME + ' ' + LAST_NAME +
                    "</a> is having an issue with the " + TOOL.toUpperCase() + " tool. Please find more info below.<p>" +
                    "<ul><li><b>Issue</b>: " + ISSUE_NAME + "</li><<li><b>Issue description</b>: " +
                    ISSUE_DESCRIPTION + "</li>" + "<li><b>OS</b>: " + os + "</li><li><b>Browser</b>: " +
                    browser + "</li><li><b>Browser version</b>: " + browserVersion + "</li></ul>", 0);

                    checkEmailBody("Hi " + FIRST_NAME + ' ' + LAST_NAME + ",<p>" +
                    "Thanks for contacting us about an issue with the " + TOOL.toUpperCase() +
                    "tool. I'm sorry for the inconvenience, we will contact you shortly. " +
                    "In the meantime please look at the info you supplied below and let us know if any of it is incorrect.<p>" +
                    "<ul><li><b>Issue</b>: " + ISSUE_NAME + "</li><<li><b>Issue description</b>: " + ISSUE_DESCRIPTION +
                    "</li>" + "<li><b>OS</b>: " + os + "</li><li><b>Browser</b>: " + browser +
                    "</li><li><b>Browser version</b>: " + browserVersion + "</li></ul>", 1);
                };

            beforeEach(function() {
                spies.responseSend = sinon.spy();
                BODY = {
                    assessment: {
                        supervisor_ID: [
                            {email: SUPERVISOR_EMAIL, firstName: SUPERVISOR_FIRST_NAME, lastName: SUPERVISOR_LAST_NAME}
                        ]
                    },
                    email: EMAIL,
                    first_name: FIRST_NAME,
                    last_name: LAST_NAME,
                    issue: {name: ISSUE_NAME, value: ISSUE_VALUE},
                    issue_description: ISSUE_DESCRIPTION,
                    tool: TOOL
                };

                ['browser', 'browserVersion', 'os'].forEach(function(field) {
                    specialFields[field] = 'None supplied';
                });
            });

            it('sends emails with default content if no special field is set', function() {});

            it('sends emails with browser verion if it is set', function() {
                specialFields.browserVersion = '40';
                BODY.browser_ver = specialFields.browserVersion;
            });

            it('sends emails with browser info if it is set', function() {
                specialFields.browser = 'Google Chrome';
                BODY.browser = specialFields.browser;
            });

            it('sends emails with browser name if it is set', function() {
                specialFields.browser = 'Chrome';
                BODY.browser_text = specialFields.browser;
            });

            it('sends emails with OS info if it is set', function() {
                specialFields.os = 'Windows XP';
                BODY.os = specialFields.os;
            });

            it('sends emails with OS name if it is set', function() {
                specialFields.os = 'Windows';
                BODY.os_text = specialFields.os;
            });

            afterEach(function() {
                contact.techSend({body: BODY}, {send: spies.responseSend});
                checkEmails(specialFields.os, specialFields.browser, specialFields.browserVersion);

                checkEmailSubject('NRGI Issue: ' + ISSUE_VALUE, 0);
                expect(mandrill.messages[0].to).to.deep.equal([
                    {email: siteEmail, name: 'Assessment tool tech support'},
                    {email: SUPERVISOR_EMAIL, name: SUPERVISOR_FIRST_NAME + ' ' + SUPERVISOR_LAST_NAME}
                ]);

                checkEmailRecipient(EMAIL, FIRST_NAME + ' ' + LAST_NAME, 1);
                checkEmailSubject('Confirmation of ' + ISSUE_VALUE + ' support ticket', 1);
                checkEmailSender(siteEmail, 1);
            });
        });

        describe('#new_user_confirmation', function() {
            var TOKEN = 'token';

            beforeEach(function() {
                contactPacket.rec_email = 'recipient email';
                contactPacket.rec_name = 'recipient name';
                contactPacket.rec_role = 'recipient role';
                contactPacket.rec_username = 'recipient username';
                contactPacket.send_email = 'sender email';
                contactPacket.send_name = 'sender name';

                contact.new_user_confirmation(contactPacket, TOKEN);
            });

            it('sends an email to the defined recipient', function() {
                checkEmailRecipient(contactPacket.rec_email, contactPacket.rec_name);
            });

            it('sends an email with the defined subject', function() {
                checkEmailSubject(contactPacket.rec_role + ' account created!');
            });

            it('sends an email with the defined HTML body', function() {
                checkEmailBody('Hello ' + contactPacket.rec_name + ',<p>' +
                    'an RGI ' + contactPacket.rec_role + ' account was just set up for you by <a href="' +
                    contactPacket.send_email + '">' + contactPacket.send_name + '</a>.<p>' +
                    'The user name is <b>' + contactPacket.rec_username + '</b>. ' +
                    'Please, <a href="' + CONFIG.baseUrl + '/reset-password/' + TOKEN + '">set up your password</a> ' +
                    'before logging in.<p>' +
                    'Thanks!<p>' +
                    'The RGI Team.');
            });
        });

        describe('#reset_password_confirmation', function() {
            var fullName, TOKEN = 'token';

            beforeEach(function() {
                contactPacket.firstName = 'chris';
                contactPacket.lastName = 'perry';
                contactPacket.email = 'cperry@gmail.com';

                fullName = 'Chris Perry';
                contact.reset_password_confirmation(contactPacket, TOKEN);
            });

            it('sends an email to the defined recipient', function() {
                checkEmailRecipient(contactPacket.email, fullName);
            });

            it('sends an email with the defined subject', function() {
                checkEmailSubject('Password Recovery');
            });

            it('sends an email with the defined HTML body', function() {
                checkEmailBody('Hello ' + fullName + ',<p>' +
                    'Please, <a href="' + CONFIG.baseUrl + '/reset-password/' + TOKEN + '">click here</a> ' +
                    'to recover your password.<p>' +
                    'Thanks!<p>' +
                    'The RGI Team.');
            });
        });

        afterEach(function() {
            checkEmailSender(siteEmail);
        });
    });

    describe('ASSESSMENT SUBMISSION EMAILS', function() {
        beforeEach(function() {
            contactPacket.admin = [{email: 'admin@google.com', name: 'Admin'}];
            contactPacket.assessment_title = 'Assessment Title';
            contactPacket.editor_firstName = 'Chris';
            contactPacket.editor_fullName = 'Chris Perry';
            contactPacket.editor_email = 'cperry@gmail.com';
            contactPacket.editor_role = 'editor';
        });

        describe('#trial_assessment_submission', function() {
            beforeEach(function() {
                contact.trial_assessment_submission(contactPacket);
            });

            it('sends the first email with the defined HTML body', function() {
                checkEmailBody("Hi team,<p>" + "<a href='" + contactPacket.editor_email + "'>" +
                contactPacket.editor_fullName + "</a> just submitted the " + contactPacket.assessment_title +
                " trial assessment for review. " + "Please visit your <a href='" + CONFIG.baseUrl +
                "/admin/assessment-admin'>assessment dashboard</a> to review.<p>" +
                "Thanks!<p>" +
                "The RGI Team.<p>", 0);
            });

            it('sends the second email with the defined HTML body', function() {
                checkEmailBody("Hi "+ contactPacket.editor_fullName + ",<p>" + "Your submission of the " +
                contactPacket.assessment_title + " trial assessment was sent to the admin team. " +
                "We will be in contact shortly with next steps. " + "Please visit your <a href='" + CONFIG.baseUrl +
                "/admin/assessment-admin'>assessment dashboard</a> if you want to check the status.<p>" +
                "Thanks!<p>" +
                "The RGI Team.<p>", 1);
            });
        });

        describe('#assessment_submission', function() {
            beforeEach(function() {
                contact.assessment_submission(contactPacket);
            });

            it('sends the first email with the defined HTML body', function() {
                checkEmailBody("Hi team,<p>" + "<a href='" + contactPacket.editor_email + "'>" +
                contactPacket.editor_fullName + "</a> just submitted the " + contactPacket.assessment_title +
                " assessment for review." + "Please visit your <a href='" + CONFIG.baseUrl +
                "/admin/assessment-admin'>assessment dashboard</a> to review.<p>" +
                "Thanks!<p>" +
                "The RGI Team.<p>", 0);
            });

            it('sends the second email with the defined HTML body', function() {
                checkEmailBody("Hi "+ contactPacket.editor_fullName + ",<p>" + "Your submission of the " +
                contactPacket.assessment_title + " assessment was sent to the admin team. " +
                "We will be in contact shortly with next steps." + "Please visit your <a href='" + CONFIG.baseUrl +
                "/admin/assessment-admin'>assessment dashboard</a> if you want to check the status.<p>" +
                "Thanks!<p>" +
                "The RGI Team.<p>", 1);
            });
        });

        afterEach(function() {
            checkEmailSender(siteEmail, 0);
            expect(mandrill.messages[0].to).to.deep.equal(contactPacket.admin);
            checkEmailSubject(contactPacket.assessment_title + ' submitted by ' + contactPacket.editor_role + ' ' +
            contactPacket.editor_fullName, 0);

            checkEmailSender(contactPacket.admin[0].email, 1);
            checkEmailRecipient(contactPacket.editor_email, contactPacket.editor_fullName, 1);
            checkEmailSubject(contactPacket.assessment_title + ' recieved.', 1);
        });
    });

    describe('EMAILS FROM ADMIN', function() {
        var checkEditorEmailSubject = function(postSubject) {
            checkEmailSubject(contactPacket.assessment_title + postSubject);
        };

        beforeEach(function() {
            contactPacket.admin = [{email: 'admin@google.com', name: 'Admin'}];
            contactPacket.assessment_title = 'Assessment Title';
            contactPacket.editor_firstName = 'Chris';
            contactPacket.editor_fullName = 'Chris Perry';
            contactPacket.editor_email = 'cperry@gmail.com';
        });

        describe('#new_assessment_assignment', function() {
            var TYPE = 'editor';

            beforeEach(function() {
                contact.new_assessment_assignment(contactPacket, TYPE);
            });

            it('sends an email with the defined subject', function() {
                checkEditorEmailSubject(' assessment assigned!');
            });

            it('sends an email with the defined HTML body', function() {
                checkEmailBody("Hello " + contactPacket.editor_firstName + ",<p>" +
                    "<a href='" + contactPacket.admin[0].email + "'>" + contactPacket.admin[0].name + "</a> " +
                    "just assigned the " + contactPacket.assessment_title + " assessement to you.<p>" +
                    "Please visit your <a href='" + CONFIG.baseUrl +
                    "/admin/assessment-admin'>assessment dashboard</a> to start the assessment.<p>" +
                    "Thanks!<p>" +
                    "The RGI Team.");
            });
        });

        describe('#trial_assessment_return', function() {
            beforeEach(function() {
                contact.trial_assessment_return(contactPacket);
            });

            it('sends an email with the defined subject', function() {
                checkEditorEmailSubject(' assessment returned for review!');
            });

            it('sends an email with the defined HTML body', function() {
                checkEmailBody("Hello " + contactPacket.editor_firstName + ",<p>" +
                    "<a href='" + contactPacket.admin[0].email + "'>" + contactPacket.admin[0].name + "</a> " +
                    "just returned the " + contactPacket.assessment_title + " trial assessement to you. " +
                    "There are a few errors we'd like you to address before moving the assessment on.<p>" +
                    "Please go to your <a href='" + CONFIG.baseUrl + "/assessments'>assessment dashboard</a> " +
                    "to take a look at flagged answers in the assessment.<p>" +
                    "Thanks!<p>" +
                    "The RGI Team.");
            });
        });

        describe('#flag_review', function() {
            beforeEach(function() {
                contact.flag_review(contactPacket);
            });

            it('sends an email with the defined subject', function() {
                checkEditorEmailSubject(' assessment returned for review!');
            });

            it('sends an email with the defined HTML body', function() {
                checkEmailBody("Hello " + contactPacket.editor_firstName + ",<p>" +
                "<a href='" + contactPacket.admin[0].email + "'>" + contactPacket.admin[0].name + "</a> " +
                "just returned the " + contactPacket.assessment_title + " assessement to you. " +
                "There are a few errors we'd like you to address before moving the assessment on.<p>" +
                "Please go to your <a href='" + CONFIG.baseUrl + "/assessments'>assessment dashboard</a> " +
                "to take a look at flagged answers in the assessment.<p>" +
                "Thanks!<p>" +
                "The RGI Team.");
            });
        });

        describe('#assessment_reassignment', function() {
            beforeEach(function() {
                contact.assessment_reassignment(contactPacket);
            });

            it('sends an email with the defined subject', function() {
                checkEmailSubject('Please begin work on the ' + contactPacket.assessment_title + ' assessment!');
            });

            it('sends an email with the defined HTML body', function() {
                checkEmailBody("Hello " + contactPacket.editor_firstName + ",<p>" +
                "<a href='" + contactPacket.admin[0].email + "'>" + contactPacket.admin[0].name + "</a> " +
                "just returned the " + contactPacket.assessment_title + " assessement to your control.<p>" +
                "Please go to your <a href='" + CONFIG.baseUrl +
                "/admin/assessment-admin'>assessment dashboard</a>.<p>" +
                "Thanks!<p>" +
                "The RGI Team.");
            });
        });

        describe('#trial_assessment_continue', function() {
            beforeEach(function() {
                contact.trial_assessment_continue(contactPacket);
            });

            it('sends an email with the defined subject', function() {
                checkEmailSubject('Please continue work on the ' + contactPacket.assessment_title + ' assessment!');
            });

            it('sends an email with the defined HTML body', function() {
                checkEmailBody("Hello " + contactPacket.editor_firstName + ",<p>" +
                "<a href='" + contactPacket.admin[0].email + "'>" + contactPacket.admin[0].name + "</a> " +
                "just approved your initial answers on the " + contactPacket.assessment_title + " assessement.<p>" +
                "Please go to your <a href='" + CONFIG.baseUrl +
                "/admin/assessment-admin'>assessment dashboard</a> to continue.<p>" +
                "Thanks!<p>" +
                "The RGI Team.");
            });
        });

        afterEach(function() {
            checkEmailRecipient(contactPacket.editor_email, contactPacket.editor_fullName);
            checkEmailSender(contactPacket.admin[0].email);
        });
    });

    afterEach(function() {
        expect(mandrill.path).to.equal('/messages/send');
    });
});
