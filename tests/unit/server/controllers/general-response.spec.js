'use strict';

var expect = require('chai').expect,
    sinon = require('sinon');


var utils = require('../utils'),
    generalResponseModule = require(utils.getControllerPath('general-response'));

describe('`general-response` module', function() {
    describe('#submit', function() {
        var res = {};

        beforeEach(function() {
            res.end = sinon.spy();
            res.send = sinon.spy();
            res.sendStatus = sinon.spy();
        });

        describe('terminate processing', function() {
            it('send status code if it is set', function() {
                var STATUS = 'status';
                generalResponseModule.submit({status: STATUS}, res);
                expect(res.sendStatus.withArgs(STATUS).called).to.equal(true);
            });

            it('send error description if it is set', function() {
                var ERROR = 'error';
                generalResponseModule.submit({error: ERROR}, res);
                expect(res.send.withArgs({reason: ERROR}).called).to.equal(true);
            });

            afterEach(function() {
                expect(res.end.called).to.equal(true);
            });
        });

        it('send error description if it is set', function() {
            var RESULT = 'result';
            generalResponseModule.submit({result: RESULT}, res);
            expect(res.send.withArgs(RESULT).called).to.equal(true);
        });
    });
});
