'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');
var User = rewire(utils.getModelPath('User'));

describe('`User` model', function() {
    var schemaMethods, spies = {};

    beforeEach(function() {
        schemaMethods = utils.getModuleLocalVariable(User, 'userSchema').methods;
    });

    describe('#authenticate', function() {
        var HASH = 'hash', PASSWORD = 'password', SALT = 'salt';

        beforeEach(function() {
            spies.EncryptHashPwd = sinon.spy(function() {
                return HASH;
            });

            schemaMethods.salt = SALT;
            utils.setModuleLocalVariable(User, 'encrypt', {hashPwd: spies.EncryptHashPwd});
        });

        it('return `true` if the password hash matches to the generated hash', function() {
            schemaMethods.hashed_pwd = HASH;
            expect(schemaMethods.authenticate(PASSWORD)).to.equal(true);
        });

        it('return `false` if the password hash does not match to the generated hash', function() {
            schemaMethods.hashed_pwd = 'another hash';
            expect(schemaMethods.authenticate(PASSWORD)).to.equal(false);
        });

        afterEach(function() {
            expect(spies.EncryptHashPwd.withArgs(SALT, PASSWORD).called).to.equal(true);
        });
    });

    describe('#hasRole', function() {
        var ROLE = 'role';

        beforeEach(function() {
            schemaMethods.role = ROLE;
        });

        it('return `true` if the role matches to the argument', function() {
            expect(schemaMethods.hasRole(ROLE)).to.equal(true);
        });

        it('return `false` if the role does not match to the argument', function() {
            expect(schemaMethods.hasRole('another role')).to.equal(false);
        });
    });

    describe('#setPassword', function() {
        var HASH = 'hash', PASSWORD = 'password', SALT = 'salt';

        beforeEach(function() {
            spies.EncryptHashPwd = sinon.spy(function() {
                return HASH;
            });

            utils.setModuleLocalVariable(User, 'encrypt', {
                hashPwd: spies.EncryptHashPwd,
                createSalt: function() {
                    return SALT;
                }
            });

            schemaMethods.save = function(callback) {
                callback();
            };

            spies.setPasswordCallback = sinon.spy();
            schemaMethods.setPassword(PASSWORD, spies.setPasswordCallback);
        });

        it('sets the salt', function() {
            expect(schemaMethods.salt).to.equal(SALT);
        });

        it('generates the password hash', function() {
            expect(spies.EncryptHashPwd.withArgs(SALT, PASSWORD).called).to.equal(true);
        });

        it('assigns the the password hash', function() {
            expect(schemaMethods.hashed_pwd).to.equal(HASH);
        });

        it('saves the data', function() {
            expect(spies.setPasswordCallback.called).to.equal(true);
        });
    });
});
