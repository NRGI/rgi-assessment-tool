'use strict';

describe('rgiResourceProcessorSrvc', function () {
    var rgiResourceProcessorSrvc, $q, rgiHttpResponseProcessorSrvc, spies = {}, stubs = {};

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiResourceProcessorSrvc_, _$q_, _rgiHttpResponseProcessorSrvc_) {
        rgiResourceProcessorSrvc = _rgiResourceProcessorSrvc_;
        $q = _$q_;
        rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
    }));

    describe('#getResponseHandler', function() {
        var dfd, handler;

        beforeEach(function() {
            dfd = {reject: sinon.spy(), resolve: sinon.spy()};
            handler = rgiResourceProcessorSrvc.getResponseHandler(dfd);
        });

        it('rejects the deferred if the error reason is set', function() {
            var response = {reason: true};
            handler(response);
            dfd.reject.withArgs(response.reason).called.should.be.equal(true);
        });

        it('rejects the deferred if the error reason is not set', function() {
            var response = {reason: false};
            handler(response);
            dfd.resolve.withArgs(response).called.should.be.equal(true);
        });
    });

    describe('#process', function() {
        var DEFERRED = {promise: 'PROMISE'}, actualResult;

        beforeEach(function() {
            stubs.$qDefer = sinon.stub($q, 'defer', function() {
                return DEFERRED;
            });

            spies.httpResponseProcessorGetDeferredHandler = sinon.spy(function(dfd) {
                return dfd.promise + '-httpFailureHandler';
            });
            stubs.httpResponseProcessorGetDeferredHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDeferredHandler',
                spies.httpResponseProcessorGetDeferredHandler);

            spies.resourceProcessorGetResponseHandler = sinon.spy(function(dfd) {
                return dfd.promise + '-resolveHandler';
            });
            stubs.resourceProcessorGetResponseHandler = sinon.stub(rgiResourceProcessorSrvc, 'getResponseHandler',
                spies.resourceProcessorGetResponseHandler);

            spies.objectMethodThen = sinon.spy();

            actualResult = rgiResourceProcessorSrvc.process({method: function() {
                return {then: spies.objectMethodThen};
            }}, 'method');
        });

        it('returns a promise', function() {
            actualResult.should.be.equal(DEFERRED.promise);
        });

        it('executes the specified method', function() {
            spies.objectMethodThen.withArgs('PROMISE-resolveHandler', 'PROMISE-httpFailureHandler').called.should.be.equal(true);
        });
    });

    describe('#delete', function() {
        var actualResult, anonymousClass = function() {}, objectId = 'ID';

        beforeEach(function() {
            spies.resourceProcessorProcess = sinon.spy(function(object) {
                return object.id;
            });
            stubs.resourceProcessorProcess = sinon.stub(rgiResourceProcessorSrvc, 'process',
                spies.resourceProcessorProcess);

            actualResult = rgiResourceProcessorSrvc.delete(anonymousClass, objectId);
        });

        it('calls `$delete` method', function() {
            spies.resourceProcessorProcess.withArgs({id: objectId}, '$delete').called.should.be.equal(true);
        });

        it('return result of the `$delete` method', function() {
            actualResult.should.be.equal(objectId);
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
