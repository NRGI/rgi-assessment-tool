'use strict';

var expect = require('chai').expect,
    sinon = require('sinon');


var utils = require('../utils'),
    generalResponseModule = require(utils.getControllerPath('general-response'));

describe('`general-response` module', function() {
    describe('#respondError', function() {
        var actualResult, res = {}, ERROR = 'error', RESPONSE_SENT = 'RESPONSE SENT';

        beforeEach(function() {
            res.send = sinon.spy(function() {
                return RESPONSE_SENT;
            });

            res.status = sinon.spy();
            actualResult = generalResponseModule.respondError(ERROR, res);
        });

        it('sends status code 400', function() {
            expect(res.status.withArgs(400).called).to.equal(true);
        });

        it('responds with the error description', function() {
            expect(res.send.withArgs({reason: ERROR}).called).to.equal(true);
        });

        it('returns result of sent response', function() {
            expect(actualResult).to.equal(RESPONSE_SENT);
        });
    });

    describe('#respondStatus', function() {
        var actualResult, res = {}, STATUS = 'status', CONNECTION_CLOSED = 'CONNECTION CLOSED';

        beforeEach(function() {
            res.end = sinon.spy(function() {
                return CONNECTION_CLOSED;
            });

            res.sendStatus = sinon.spy();
            actualResult = generalResponseModule.respondStatus(STATUS, res);
        });

        it('sends status code 400', function() {
            expect(res.sendStatus.withArgs(STATUS).called).to.equal(true);
        });

        it('closes the connection', function() {
            expect(res.end.called).to.equal(true);
        });

        it('returns result of the connection close', function() {
            expect(actualResult).to.equal(CONNECTION_CLOSED);
        });
    });

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
