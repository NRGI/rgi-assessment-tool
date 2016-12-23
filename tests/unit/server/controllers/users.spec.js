'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');

utils.stubModel();
    var usersModule = rewire(utils.getControllerPath('users'));
utils.restoreModel();

describe('`users` module', function() {
    var spies = {}, callbacks = {}, USER_ID = 'user id',
        getUserFindCallbackCheck = function(callbackName, err) {
            return function() {
                var USER_DATA = 'user data';
                callbacks[callbackName](err || null, USER_DATA);
                expect(spies.responseSend.withArgs(err ? {reason: err.toString()} : USER_DATA).called).to.equal(true);
            };
        },
        setUserHasRoleSpy = function(result) {
            spies.userHasRole = sinon.spy(function() {
                return result;
            });
        };

    beforeEach(function() {
        spies = {};
        spies.responseSend = sinon.spy();
    });

    describe('#getUserByID', function() {
        beforeEach(function() {
            spies.userFindOne = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.userFindOne = callback;
                }};
            });

            utils.setModuleLocalVariable(usersModule, 'User', {findOne: spies.userFindOne});
            usersModule.getUserByID({params: {id: USER_ID}}, {send: spies.responseSend});
        });

        it('submits a request to find a user by provided id', function() {
            expect(spies.userFindOne.withArgs({_id: USER_ID}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('responds with the user data if no error occurs', getUserFindCallbackCheck('userFindOne'));
            it('responds with the error description if an error occurs', getUserFindCallbackCheck('userFindOne', 'err'));
        });
    });

    describe('#getUsers', function() {
        var QUERY = 'query',
            initialize = function(userFindResult, hasRole) {
                spies.userFind = sinon.spy(function() {
                    return userFindResult;
                });

                setUserHasRoleSpy(hasRole);
                utils.setModuleLocalVariable(usersModule, 'User', {find: spies.userFind});
                usersModule.getUsers({user: {hasRole: spies.userHasRole}, query: QUERY}, {send: spies.responseSend});
            };

        it('selects all fields for a supervisor', function() {
            initialize({exec: function(callback) {
                callbacks.userFind = callback;
            }}, true);
        });

        it('selects special fields for a non-supervisor', function() {
            spies.userSelect = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.userFind = callback;
                }};
            });

            initialize({select: spies.userSelect}, false);
            expect(spies.userSelect.withArgs({firstName: 1, lastName: 1}).called).to.equal(true);
        });

        afterEach(function() {
            expect(spies.userFind.withArgs(QUERY).called).to.equal(true);
            expect(spies.userHasRole.withArgs('supervisor').called).to.equal(true);
            getUserFindCallbackCheck('userFind')();
            getUserFindCallbackCheck('userFind', 'find user error')();
        });
    });

    describe('#createUser', function() {
        var BODY, SALT = 'salt', USERNAME = 'UserName', CURRENT_USER = {
            _id: 'user id',
            email: 'original-email@gmail.com',
            firstName: 'First Name',
            lastName: 'Last Name'
        };

        beforeEach(function() {
            utils.setModuleLocalVariable(usersModule, 'encrypt', {
                createSalt: function() {return SALT;},
                hashPwd: function(salt, password) {return salt + password;}
            });

            spies.userCreate = sinon.spy(function(userData, callback) {
                callbacks.userCreate = callback;
            });

            spies.resetPasswordTokenCreateByUser = sinon.spy(function(userId, callback) {
                callbacks.resetPasswordTokenCreateByUser = callback;
            });

            utils.setModuleLocalVariable(usersModule, 'ResetPasswordToken',
                {createByUser: spies.resetPasswordTokenCreateByUser});

            spies.contactNewUserConfirmation = sinon.spy();
            utils.setModuleLocalVariable(usersModule, 'contact',
                {new_user_confirmation: spies.contactNewUserConfirmation});

            BODY = {username: USERNAME};
            BODY.firstName = 'chris';
            BODY.lastName = 'perry';
            BODY.email = 'modified-email@gmail.com';
            BODY.role = 'modified role';

            utils.setModuleLocalVariable(usersModule, 'User', {create: spies.userCreate});
            spies.responseStatus = sinon.spy();

            usersModule.createUser({body: BODY, user: CURRENT_USER},
                {send: spies.responseSend, status: spies.responseStatus});
        });

        it('submits a request to create a new user record', function() {
            expect(spies.userCreate.withArgs(BODY).called).to.equal(true);
        });

        it('sets the salt to hash the password', function() {
            expect(BODY.salt).to.equal(SALT);
        });

        it('sets the user temporary password', function() {
            expect(new Date().getTime() - new Date(BODY.password).getTime() < 300).to.equal(true);
        });

        it('sets hashed password', function() {
            expect(BODY.hashed_pwd).to.equal(BODY.salt + BODY.password);
        });

        it('sets the account creator', function() {
            expect(BODY.createdBy).to.equal(CURRENT_USER._id);
        });

        it('formats the username', function() {
            expect(BODY.username).to.equal(USERNAME.toLowerCase());
        });

        describe('CALLBACK', function() {
            describe('FAILURE CASE', function() {
                it('responds with the error description if a regular error occurs', function() {
                    var ERROR = 'regular error';
                    callbacks.userCreate(ERROR);
                    expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
                });

                it('responds with a predefined description if a special error occurs', function() {
                    callbacks.userCreate('special E11000 error');
                    expect(spies.responseSend.withArgs({reason: new Error('Duplicate Username').toString()}).called)
                        .to.equal(true);
                });

                afterEach(function() {
                    expect(spies.responseStatus.withArgs(400).called).to.equal(true);
                });
            });

            describe('SUCCESS CASE', function() {
                beforeEach(function() {
                    callbacks.userCreate(null, CURRENT_USER);
                });

                it('submits a request to create a reset password token', function() {
                    expect(spies.resetPasswordTokenCreateByUser.withArgs(CURRENT_USER._id).called).to.equal(true);
                });

                it('responds with an empty response', function() {
                    expect(spies.responseSend.called).to.equal(true);
                    expect(spies.responseSend.args[0][0]).to.equal(undefined);
                });

                describe('CREATE RESET PASSWORD TOKEN CALLBACK', function() {
                    it('sends a notification about the newly created user', function() {
                        var TOKEN_ID = 'token id';
                        callbacks.resetPasswordTokenCreateByUser(null, {_id: TOKEN_ID});

                        expect(spies.contactNewUserConfirmation.withArgs({
                            send_name: CURRENT_USER.firstName + ' ' + CURRENT_USER.lastName,
                            send_email: CURRENT_USER.email,
                            rec_name: 'Chris Perry',
                            rec_username: USERNAME.toLowerCase(),
                            rec_email: BODY.email,
                            rec_role: 'Modified role'
                        }, TOKEN_ID).called).to.equal(true);
                    });

                    it('does not send a notification if an error occurs', function() {
                        callbacks.resetPasswordTokenCreateByUser(true);
                        expect(spies.contactNewUserConfirmation.called).to.equal(false);
                    });
                });
            });
        });
    });

    describe('#updateUser', function() {
        var USER_ID = 'user id',
            getCurrentUser = function(currentUserId, hasRole) {
                spies.userHasRole = sinon.spy(function() {
                    return hasRole;
                });

                return {_id: currentUserId, hasRole: spies.userHasRole};
            };

        beforeEach(function() {
            spies.responseStatus = sinon.spy();
        });

        describe('UNAUTHORIZED CASE', function() {
            beforeEach(function() {
                spies.responseEnd = sinon.spy();
                usersModule.updateUser({body: {_id: USER_ID}, user: getCurrentUser('another user id', false)},
                    {end: spies.responseEnd, sendStatus: spies.responseStatus});
            });

            it('closes the connection', function() {
                expect(spies.responseEnd.called).to.equal(true);
            });

            it('sets the response status to 403', function() {
                expect(spies.responseStatus.withArgs(403).called).to.equal(true);
            });
        });

        describe('AUTHORIZED CASE', function() {
            beforeEach(function() {
                spies.userFindOne = sinon.spy(function() {
                    return {exec: function(callback) {
                        callbacks.userFindOne = callback;
                    }};
                });

                utils.setModuleLocalVariable(usersModule, 'User', {findOne: spies.userFindOne});
            });

            it('allows a supervisor to modify any user profile', function() {
                usersModule.updateUser({body: {_id: USER_ID}, user: getCurrentUser('another user id', true)}, {});
            });

            describe('own profile modification', function() {
                var req;

                beforeEach(function() {
                    req = {body: {_id: USER_ID}, user: getCurrentUser(USER_ID, false)};
                    usersModule.updateUser(req, {send: spies.responseSend, status: spies.responseStatus});
                });

                describe('FIND USER ERROR CASE', function() {
                    var ERROR = 'find user error';

                    beforeEach(function() {
                        callbacks.userFindOne(ERROR);
                    });

                    it('sets the response status to 400', function() {
                        expect(spies.responseStatus.withArgs(400).called).to.equal(true);
                    });

                    it('responds with the error description', function() {
                        expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
                    });
                });

                describe('NO USER FOUND CASE', function() {
                    beforeEach(function() {
                        callbacks.userFindOne(null, null);
                    });

                    it('sets the response status to 404', function() {
                        expect(spies.responseStatus.withArgs(404).called).to.equal(true);
                    });

                    it('responds with the error description', function() {
                        expect(spies.responseSend.withArgs({reason: 'User not found'}).called).to.equal(true);
                    });
                });

                describe('SUCCESS CASE', function() {
                    var USER, copiedFields = [
                        'firstName',
                        'lastName',
                        'disabled',
                        'email',
                        'role',
                        'address',
                        'language',
                        'assessments',
                        'documents',
                        'interviewees'
                    ];

                    beforeEach(function() {
                        spies.userSave = sinon.spy(function(callback) {
                            callbacks.userSave = callback;
                        });

                        USER = {save: spies.userSave};

                        copiedFields.forEach(function(field) {
                            req.body[field] = field + ' value';
                        });
                    });

                    var checkUserModification = function() {
                        it('assign modified data to the user object', function() {
                            copiedFields.forEach(function(field) {
                                expect(USER[field]).to.equal(req.body[field]);
                            });
                        });

                        it('submits a request to update the user data', function() {
                            expect(spies.userSave.called).to.equal(true);
                        });

                        describe('SAVE USER CALLBACK', function() {
                            it('responds with the error description if an error occurs', function() {
                                var ERROR = 'save user error';
                                callbacks.userSave(ERROR);
                                expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
                            });

                            it('responds with the modified user data if no errors occur', function() {
                                callbacks.userSave(null);
                                expect(spies.responseSend.withArgs(USER).called).to.equal(true);
                            });
                        });
                    };

                    describe('save without password modification', function() {
                        beforeEach(function() {
                            callbacks.userFindOne(null, USER);
                        });

                        checkUserModification();
                    });

                    describe('save with password modification', function() {
                        var PASSWORD = 'password';

                        beforeEach(function() {
                            spies.userSetPassword = sinon.spy(function(password, callback) {
                                callbacks.userSetPassword = callback;
                            });

                            USER.setPassword = spies.userSetPassword;
                            req.body.password = PASSWORD;
                            callbacks.userFindOne(null, USER);
                        });

                        it('responds with the error description if an error occurs', function() {
                            var ERROR = 'save user error';
                            callbacks.userSetPassword(ERROR);
                            expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
                        });

                        describe('SUCCESS CASE', function() {
                            beforeEach(function() {
                                callbacks.userSetPassword(null);
                            });

                            checkUserModification();
                        });

                        afterEach(function() {
                            expect(spies.userSetPassword.withArgs(PASSWORD).called).to.equal(true);
                        });
                    });
                });
            });

            afterEach(function() {
                expect(spies.userFindOne.withArgs({_id: USER_ID}).called).to.equal(true);
            });
        });
    });

    describe('#deleteUser', function() {
        beforeEach(function() {
            spies.userRemove = sinon.spy(function(criteria, callback) {
                callbacks.userRemove = callback;
            });

            utils.setModuleLocalVariable(usersModule, 'User', {remove: spies.userRemove});
            usersModule.deleteUser({params: {id: USER_ID}}, {send: spies.responseSend});
        });

        it('submits a request to remove the user record', function() {
            expect(spies.userRemove.withArgs({_id: USER_ID}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('responds with an empty response if no error occurs', function() {
                callbacks.userRemove(null, 'RESPONSE');
                expect(spies.responseSend.withArgs(undefined).called).to.equal(true);
            });

            it('responds with an empty response if no error occurs', function() {
                callbacks.userRemove(null, 'RESPONSE');
                expect(spies.responseSend.withArgs(undefined).called).to.equal(true);
            });

            it('responds with the error if an error occurs', function() {
                var ERROR = 'error';
                callbacks.userRemove(ERROR);
                expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(true);
            });
        });
    });
});
