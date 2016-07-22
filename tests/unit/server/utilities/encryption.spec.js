'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');
var encryption = rewire(utils.getUtilityPath('encryption'));

describe('`encryption` utility', function() {
    var spies = {};

    describe('#createSalt', function() {
        beforeEach(function() {
            spies.toString = sinon.spy();
            spies.randomBytes = sinon.spy(function() {
                return {toString: spies.toString};
            });

            utils.setModuleLocalVariable(encryption, 'crypto', {randomBytes: spies.randomBytes});
            encryption.createSalt();
        });

        it('create random bytes of the defined length', function() {
            expect(spies.randomBytes.withArgs(128).called).to.equal(true);
        });

        it('converts the random bytes to a string', function() {
            expect(spies.toString.withArgs('base64').called).to.equal(true);
        });
    });

    describe('#hashPwd', function() {
        var actualResult, SALT = 'salt', PASSWORD = 'password', RESULT = 'result';

        beforeEach(function() {
            spies.digest = sinon.spy(function() {
                return RESULT;
            });

            spies.update = sinon.spy(function() {
                return {digest: spies.digest};
            });

            spies.createHmac = sinon.spy(function() {
                return {update: spies.update};
            });

            utils.setModuleLocalVariable(encryption, 'crypto', {createHmac: spies.createHmac});
            actualResult = encryption.hashPwd(SALT, PASSWORD);
        });

        it('create a hash code', function() {
            expect(spies.createHmac.withArgs('sha1', SALT).called).to.equal(true);
        });

        it('applies the hash code to the password', function() {
            expect(spies.update.withArgs(PASSWORD).called).to.equal(true);
        });

        it('converts the hash code to hexadecimal representation', function() {
            expect(spies.digest.withArgs('hex').called).to.equal(true);
        });

        it('returns the hexadecimal representation', function() {
            expect(actualResult).to.equal(RESULT);
        });
    });
});
