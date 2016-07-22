'use strict';

var expect = require('chai').expect,
    sinon = require('sinon');

var utils = require('../utils');
var ResetPasswordToken = require(utils.getModelPath('ResetPasswordToken'));

describe('`ResetPasswordToken` model', function() {
    var spies = {}, stubs = {};

    describe('#createByUser', function() {
        var TOKENS = 'tokens', USER_ID = 'user id';

        beforeEach(function() {
            spies.create = sinon.spy(function(criteria, callback) {
                callback(TOKENS);
            });

            stubs.create = sinon.stub(ResetPasswordToken, 'create', spies.create);
            spies.createByUserCallback = sinon.spy();
            ResetPasswordToken.createByUser(USER_ID, spies.createByUserCallback);
        });

        it('sends a request to get tokens by user', function() {
            expect(spies.create.withArgs({user: USER_ID}).called).to.equal(true);
        });

        it('calls the provided callback with the tokens', function() {
            expect(spies.createByUserCallback.withArgs(TOKENS).called).to.equal(true);
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
