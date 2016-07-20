'use strict';

var expect = require('chai').expect,
    sinon = require('sinon');

var utils = require('../utils'),
    generalResponseModule = require(utils.getControllerPath('general-response'));

describe('`general-response` module', function() {
    describe('#getObjectSet', function() {
        var spies, callbacks = {}, METHOD_NAME = 'getObjectSet', CRITERIA = 'criteria', ERROR_MESSAGE = 'error message';

        beforeEach(function() {
            spies = {responseSend: sinon.spy()};

            spies[METHOD_NAME] = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.getObjectSet = callback;
                }};
            });

            generalResponseModule.getObjectSet(spies, METHOD_NAME, CRITERIA, ERROR_MESSAGE, {send: spies.responseSend});
        });

        it('submits a request ti get the object data', function() {
            expect(spies[METHOD_NAME].withArgs(CRITERIA).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('responds with the error description if an error occurs', function() {
                var ERROR = 'error';
                callbacks.getObjectSet(ERROR);
                expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
            });

            it('responds with a special error description if no objects are found', function() {
                callbacks.getObjectSet(null, null);
                expect(spies.responseSend.withArgs({reason: new Error(ERROR_MESSAGE).toString()}).called).to.equal(true);
            });

            it('responds with the objects data if the data are found', function() {
                var OBJECTS = 'objects';
                callbacks.getObjectSet(null, OBJECTS);
                expect(spies.responseSend.withArgs(OBJECTS).called).to.equal(true);
            });
        });
    });

    describe('#respondError', function() {
        var actualResult, res, ERROR = 'error', RESPONSE_SENT = 'RESPONSE SENT';

        beforeEach(function() {
            res = {};
            res.status = sinon.spy();

            res.send = sinon.spy(function() {
                return RESPONSE_SENT;
            });
        });

        describe('DEFAULT STATUS', function() {
            beforeEach(function() {
                actualResult = generalResponseModule.respondError(res, ERROR);
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

        it('sends provided status code', function() {
            var STATUS_CODE = 500;
            actualResult = generalResponseModule.respondError(res, ERROR, STATUS_CODE);
            expect(res.status.withArgs(STATUS_CODE).called).to.equal(true);
        });
    });

    describe('#respondStatus', function() {
        var actualResult, res = {}, STATUS = 'status', CONNECTION_CLOSED = 'CONNECTION CLOSED';

        beforeEach(function() {
            res.end = sinon.spy(function() {
                return CONNECTION_CLOSED;
            });

            res.sendStatus = sinon.spy();
            actualResult = generalResponseModule.respondStatus(res, STATUS);
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
