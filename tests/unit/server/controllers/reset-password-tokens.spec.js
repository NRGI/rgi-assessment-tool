'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');

utils.stubModel();
    var resetPasswordTokensModule = rewire(utils.getControllerPath('reset-password-tokens'));
utils.restoreModel();

describe('`reset-password-tokens` module', function() {
    var callbacks = {}, spies = {};

    beforeEach(function() {
        spies.responseSend = sinon.spy();
    });

    describe('#create', function() {
        var EMAIL = 'email';

        beforeEach(function() {
            spies.userFindOne = sinon.spy(function(criteria, callback) {
                callbacks.userFindOneCallback = callback;
            });

            utils.setModuleLocalVariable(resetPasswordTokensModule, 'User', {findOne: spies.userFindOne});
            resetPasswordTokensModule.create({body: {email: EMAIL}}, {send: spies.responseSend});
        });

        it('sends a request to get the user data by email', function() {
            expect(spies.userFindOne.withArgs({email: EMAIL}).called).to.equal(true);
        });

        describe('FIND USER CALLBACK', function() {
            describe('INVALID RESPONSE', function() {
                it('shows an error message in case of a failure', function() {
                    callbacks.userFindOneCallback(true, true);
                });

                it('shows an error message if the token list is empty', function() {
                    callbacks.userFindOneCallback(false, false);
                });

                afterEach(function() {
                    expect(spies.responseSend.withArgs({error: 'USER_NOT_FOUND'}).called).to.equal(true);
                });
            });

            describe('VALID RESPONSE', function() {
                var USER_ID = 'user id';

                beforeEach(function() {
                    spies.ResetPasswordTokenCreateByUser = sinon.spy(function(criteria, callback) {
                        callbacks.ResetPasswordTokenCreateByUserCallback = callback;
                    });

                    utils.setModuleLocalVariable(resetPasswordTokensModule, 'ResetPasswordToken',
                        {createByUser: spies.ResetPasswordTokenCreateByUser});
                    callbacks.userFindOneCallback(false, {_id: USER_ID});
                });

                it('sends a request to get the token data by user', function() {
                    expect(spies.ResetPasswordTokenCreateByUser.withArgs(USER_ID).called).to.equal(true);
                });

                describe('RESET PASSWORD TOKEN CREATE BY USER CALLBACK', function() {
                    var ERROR, TOKEN = {_id: 'token id'};

                    beforeEach(function() {
                        spies.contactResetPasswordConfirmation = sinon.spy();
                        utils.setModuleLocalVariable(resetPasswordTokensModule, 'contact',
                            {reset_password_confirmation: spies.contactResetPasswordConfirmation});
                    });

                    it('sends an email if no error is got', function() {
                        ERROR = false;
                        callbacks.ResetPasswordTokenCreateByUserCallback(ERROR, TOKEN);
                        expect(spies.contactResetPasswordConfirmation.withArgs({_id: USER_ID}, TOKEN._id).called)
                            .to.equal(true);
                    });

                    it('does not send an email if an error is got', function() {
                        ERROR = true;
                        callbacks.ResetPasswordTokenCreateByUserCallback(ERROR, TOKEN);
                        expect(spies.contactResetPasswordConfirmation.called).to.equal(false);
                    });

                    afterEach(function() {
                        expect(spies.responseSend.withArgs({error: ERROR, token: TOKEN}).called).to.equal(true);
                    });
                });
            });
        });
    });

    describe('#reset', function() {
        var TOKEN_ID = 'token id', PASSWORD = 'password';

        beforeEach(function() {
            spies.resetPasswordTokenFindOne = sinon.spy(function(criteria, callback) {
                callbacks.resetPasswordTokenFindOneCallback = callback;
            });

            utils.setModuleLocalVariable(resetPasswordTokensModule, 'ResetPasswordToken',
                {findOne: spies.resetPasswordTokenFindOne});
            resetPasswordTokensModule.reset({body: {token: TOKEN_ID, password: PASSWORD}}, {send: spies.responseSend});
        });

        it('sends a request to get a token by its id', function() {
            expect(spies.resetPasswordTokenFindOne.withArgs({_id: TOKEN_ID}).called).to.equal(true);
        });

        describe('RESET PASSWORD TOKEN FIND ONE CALLBACK', function() {
            describe('INVALID RESPONSE', function() {
                it('responds with an error if a failure occurs', function() {
                    callbacks.resetPasswordTokenFindOneCallback(true, true);
                });

                it('responds with an error if the token is not found', function() {
                    callbacks.resetPasswordTokenFindOneCallback(false, false);
                });

                afterEach(function() {
                    expect(spies.responseSend.withArgs({error: 'TOKEN_NOT_FOUND'}).called).to.equal(true);
                });
            });

            describe('VALID RESPONSE', function() {
                var USER_ID = 'user id';

                beforeEach(function() {
                    spies.userFindOne = sinon.spy(function(criteria, callback) {
                        callbacks.userFindOneCallback = callback;
                    });

                    utils.setModuleLocalVariable(resetPasswordTokensModule, 'User', {findOne: spies.userFindOne});
                    spies.tokenRemove = sinon.spy();
                    callbacks.resetPasswordTokenFindOneCallback(false, {remove: spies.tokenRemove, user: USER_ID});
                });

                it('sends a request to get user data by its id', function() {
                    expect(spies.userFindOne.withArgs({_id: USER_ID}).called).to.equal(true);
                });

                describe('USER FIND ONE CALLBACK', function() {
                    describe('INVALID RESPONSE', function () {
                        it('responds with an error if a failure occurs', function () {
                            callbacks.userFindOneCallback(true, true);
                        });

                        it('responds with an error if the token is not found', function () {
                            callbacks.userFindOneCallback(false, false);
                        });

                        afterEach(function () {
                            expect(spies.responseSend.withArgs({error: 'USER_NOT_FOUND'}).called).to.equal(true);
                        });
                    });

                    describe('VALID RESPONSE', function() {
                        beforeEach(function() {
                            spies.userSetPassword = sinon.spy(function(password, callback) {
                                callbacks.userSetPasswordCallback = callback;
                            });
                            callbacks.userFindOneCallback(false, {setPassword: spies.userSetPassword});
                        });

                        it('sends a request to modify the user password', function() {
                            expect(spies.userSetPassword.withArgs(PASSWORD).called).to.equal(true);
                        });

                        describe('USER SET PASSWORD CALLBACK', function() {
                            describe('VALID RESPONSE', function () {
                                beforeEach(function () {
                                    callbacks.userSetPasswordCallback(false);
                                });

                                it('removes the token record', function () {
                                    expect(spies.tokenRemove.called).to.equal(true);
                                });

                                it('responds with an empty response', function () {
                                    expect(spies.responseSend.withArgs({}).called).to.equal(true);
                                });
                            });

                            it('responds with an error code if the request fails', function () {
                                callbacks.userSetPasswordCallback(true);
                                expect(spies.responseSend.withArgs({error: 'SET_PASSWORD_ERROR'}).called).to.equal(true);
                            });
                        });
                    });
                });
            });
        });
    });
});
