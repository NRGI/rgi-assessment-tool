'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');


var utils = require('../utils');

utils.stubModel();
    var passportModule = rewire(utils.getConfigPath('passport'));
utils.restoreModel();

describe('`passport` module', function() {
    var spies = {}, callbacks = {};

    beforeEach(function() {
        spies.localStrategyPrototype = sinon.spy(function(callback) {
            callbacks.localStrategyPrototype = callback;
        });

        spies.passportUse = sinon.spy(function(callback) {
            callbacks.passportUse = callback;
        });

        spies.passportSerializeUser = sinon.spy(function(callback) {
            callbacks.passportSerializeUser = callback;
        });

        spies.passportDeserializeUser = sinon.spy(function(callback) {
            callbacks.passportDeserializeUser = callback;
        });

        utils.setModuleLocalVariable(passportModule, 'passport', {
            use: spies.passportUse,
            serializeUser: spies.passportSerializeUser,
            deserializeUser: spies.passportDeserializeUser
        });

        utils.setModuleLocalVariable(passportModule, 'LocalStrategy', spies.localStrategyPrototype);
        passportModule();
    });

    it('uses passport', function() {
        expect(spies.passportUse.called).to.equal(true);
    });

    it('creates local strategy', function() {
        expect(spies.localStrategyPrototype.called).to.equal(true);
    });

    it('configures user serialization', function() {
        expect(spies.passportSerializeUser.called).to.equal(true);
    });

    it('configures user serialization', function() {
        expect(spies.passportDeserializeUser.called).to.equal(true);
    });

    describe('`LocalStrategy` callback', function() {
        var USERNAME = 'username', PASSWORD = 'password';

        beforeEach(function() {
            spies.userExec = sinon.spy(function(callback) {
                callbacks.userExec = callback;
            });

            spies.userFindOne = sinon.spy(function() {
                return {exec: spies.userExec};
            });

            spies.done = sinon.spy();
            utils.setModuleLocalVariable(passportModule, 'User', {findOne: spies.userFindOne});
            callbacks.localStrategyPrototype(USERNAME, PASSWORD, spies.done);
        });

        it('searches a user by username', function() {
            expect(spies.userFindOne.withArgs({username: USERNAME}).called).to.equal(true);
        });

        it('processes the user data', function() {
            expect(spies.userExec.called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('submits an empty response if empty user data are got', function() {
                callbacks.userExec(null, null);
                expect(spies.done.withArgs(null ,false).called).to.equal(true);
            });

            describe('AUTHENTICATION', function() {
                it('submits an empty response if authentication fails', function() {
                    spies.authenticate = sinon.spy(function() {
                        return false;
                    });

                    callbacks.userExec(null, {authenticate: spies.authenticate});
                    expect(spies.done.withArgs(null ,false).called).to.equal(true);
                });

                it('submits an empty response if authentication fails', function() {
                    spies.authenticate = sinon.spy(function() {
                        return true;
                    });

                    var USER = {authenticate: spies.authenticate};
                    callbacks.userExec(null, USER);
                    expect(spies.done.withArgs(null ,USER).called).to.equal(true);
                });

                afterEach(function() {
                    expect(spies.authenticate.withArgs(PASSWORD).called).to.equal(true);
                });
            });
        });
    });

    describe('`serializeUser` callback', function() {
        beforeEach(function() {
            spies.done = sinon.spy();
        });

        it('does nothing if no user is found', function() {
            callbacks.passportSerializeUser(false, spies.done);
            expect(spies.done.called).to.equal(false);
        });

        it('responds with the found user data', function() {
            var USER_ID = 'user id';
            callbacks.passportSerializeUser({_id: USER_ID}, spies.done);
            expect(spies.done.withArgs(null, USER_ID).called).to.equal(true);
        });
    });

    describe('`deserializeUser` callback', function() {
        var USER_ID = 'user id';

        beforeEach(function() {
            spies.userFindOne = sinon.spy(function() {
                return {
                    exec: function (callback) {
                        callbacks.userFindOne = callback;
                    }
                };
            });

            utils.setModuleLocalVariable(passportModule, 'User', {findOne: spies.userFindOne});
            spies.done = sinon.spy();
            callbacks.passportDeserializeUser(USER_ID, spies.done);
        });

        it('searches a user by id', function() {
            expect(spies.userFindOne.withArgs({_id: USER_ID}).called).to.equal(true);
        });

        it('submits an empty response if no user is found', function() {
            callbacks.userFindOne(null, null);
            expect(spies.done.withArgs(null, false).called).to.equal(true);
        });

        it('responds with the found user data', function() {
            var USER = 'user';
            callbacks.userFindOne(null, USER);
            expect(spies.done.withArgs(null, USER).called).to.equal(true);
        });

    });
});
