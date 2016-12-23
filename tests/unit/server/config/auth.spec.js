'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');


var utils = require('../utils');

utils.stubModel();
    var authModule = rewire(utils.getConfigPath('auth'));
utils.restoreModel();

describe('`auth` module', function() {
    var spies = {}, callbacks = {}, REQUEST, RESPONSE, BODY = {username: 'UserName'};

    describe('#authenticate', function() {
        beforeEach(function() {
            spies.resSend = sinon.spy();
            spies.authenticateResult = sinon.spy();

            spies.authenticate = sinon.spy(function(env, callback) {
                callbacks.authenticate = callback;
                return spies.authenticateResult;
            });

            spies.logIn = sinon.spy(function(user, callback) {
                callbacks.logIn = callback;
            });

            REQUEST = {body: BODY, logIn: spies.logIn};
            RESPONSE = {send: spies.resSend};

            utils.setModuleLocalVariable(authModule, 'passport', {authenticate: spies.authenticate});
            authModule.authenticate(REQUEST, RESPONSE);
        });

        it('converts the username to lowercase', function() {
            expect(BODY.username).to.equal('username');
        });

        it('creates an authentication request', function() {
            expect(spies.authenticate.withArgs('local').called).to.equal(true);
        });

        it('submits authentication request', function() {
            expect(spies.authenticateResult.withArgs(REQUEST, RESPONSE).called).to.equal(true);
        });

        describe('`authenticate` CALLBACK', function() {
            it('responds with a failure if an error occurs', function() {
                callbacks.authenticate(true, true);
                expect(spies.resSend.withArgs({success: false}).called).to.equal(true);
            });

            it('responds with a failure if the user data are empty', function() {
                callbacks.authenticate(null, false);
                expect(spies.resSend.withArgs({success: false}).called).to.equal(true);
            });

            it('responds with a failure and error message if the user account is deactivated', function() {
                callbacks.authenticate(null, {disabled: true});
                expect(spies.resSend.withArgs({success: false, reason: 'Account is deactivated'}).called).to.equal(true);
            });

            describe('`logIn` CALLBACK', function() {
                var USER = {disabled: false, _id: 'user id'};

                beforeEach(function() {
                    callbacks.authenticate(null, USER);
                });

                it('responds with a failure if an error occurs', function() {
                    callbacks.logIn(true);
                    expect(spies.resSend.withArgs({success: false}).called).to.equal(true);
                });

                describe('NO ERROR CASE', function() {
                    beforeEach(function() {
                        spies.authLogLog = sinon.spy();
                        utils.setModuleLocalVariable(authModule, 'AuthLog', {log: spies.authLogLog});
                        callbacks.logIn(null);
                    });

                    it('sets the user data', function() {
                        expect(REQUEST.user).deep.equal(USER);
                    });

                    it('logs the user authentication', function() {
                        expect(spies.authLogLog.withArgs(USER._id, 'sign-in').called).to.equal(true);
                    });

                    it('sets the client id', function() {
                        expect(REQUEST.clientId).to.equal(1560);
                    });

                    it('responds with the user data', function() {
                        expect(spies.resSend.withArgs({success: true, user: USER}).called).to.equal(true);
                    });
                });
            });
        });
    });

    describe('#logout', function() {
        var USER_ID = 'user id',
            setAuthenticated = function(authenticated) {
                ['log', 'logout', 'end'].forEach(function(spyName) {
                    spies[spyName] = sinon.spy();
                });

                spies.isAuthenticated = sinon.spy(function() {
                    return authenticated;
                });

                utils.setModuleLocalVariable(authModule, 'AuthLog', {log: spies.log});

                authModule.logout({user: {_id: USER_ID}, isAuthenticated: spies.isAuthenticated, logout: spies.logout},
                    {end: spies.end});
            };

        describe('NOT AUTHENTICATED CASE', function() {
            beforeEach(function() {
                setAuthenticated(false);
            });

            it('does not log the user sign out', function() {
                expect(spies.log.called).to.equal(false);
            });

            it('does not log the user out', function() {
                expect(spies.logout.called).to.equal(false);
            });
        });

        describe('AUTHENTICATED CASE', function() {
            beforeEach(function() {
                setAuthenticated(true);
            });

            it('logs the user sign out', function() {
                expect(spies.log.withArgs(USER_ID, 'sign-out').called).to.equal(true);
            });

            it('logs the user out', function() {
                expect(spies.logout.called).to.equal(true);
            });
        });

        afterEach(function() {
            expect(spies.end.called).to.equal(true);
        });
    });

    describe('#requiresApiLogin', function() {
        var setAuthenticated = function(authenticated) {
                ['end', 'next', 'status'].forEach(function(spyName) {
                    spies[spyName] = sinon.spy();
                });

                spies.isAuthenticated = sinon.spy(function() {
                    return authenticated;
                });

                authModule.requiresApiLogin({isAuthenticated: spies.isAuthenticated},
                    {end: spies.end, status: spies.status}, spies.next);
            };

        describe('NOT AUTHENTICATED CASE', function() {
            beforeEach(function() {
                setAuthenticated(false);
            });

            it('responds with 403 status', function() {
                expect(spies.status.withArgs(403).called).to.equal(true);
            });

            it('does not log the user out', function() {
                expect(spies.end.called).to.equal(true);
            });
        });

        it('executes the next handler for an authenticated user', function() {
            setAuthenticated(true);
            expect(spies.next.called).to.equal(true);
        });
    });

    describe('#requiresRole', function() {
        var ROLE = 'researcher';

        var setAuthenticated = function(authenticated, role) {
            ['end', 'next', 'status'].forEach(function(spyName) {
                spies[spyName] = sinon.spy();
            });

            spies.isAuthenticated = sinon.spy(function() {
                return authenticated;
            });

            authModule.requiresRole(role)({isAuthenticated: spies.isAuthenticated, user: {role: ROLE}},
                {end: spies.end, status: spies.status}, spies.next);
        };

        describe('NOT AUTHENTICATED CASE', function() {
            beforeEach(function() {
                setAuthenticated(false);
            });

            it('responds with 403 status', function() {
                expect(spies.status.withArgs(403).called).to.equal(true);
            });

            it('does not log the user out', function() {
                expect(spies.end.called).to.equal(true);
            });
        });

        describe('AUTHENTICATED BUT ANOTHER ROLE CASE', function() {
            beforeEach(function() {
                setAuthenticated(true, 'ANOTHER ROLE');
            });

            it('responds with 403 status', function() {
                expect(spies.status.withArgs(403).called).to.equal(true);
            });

            it('does not log the user out', function() {
                expect(spies.end.called).to.equal(true);
            });
        });

        it('executes the next handler for an authenticated user', function() {
            setAuthenticated(true, ROLE);
            expect(spies.next.called).to.equal(true);
        });
    });
});
