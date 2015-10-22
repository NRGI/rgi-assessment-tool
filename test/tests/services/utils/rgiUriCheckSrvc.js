'use strict';

describe('rgiUrlCheckSrvc', function () {
    var rgiUrlCheckSrvc, rgiRequestSubmitterSrvc, $q;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiUrlCheckSrvc_, _$q_, _rgiRequestSubmitterSrvc_) {
        $q = _$q_;
        rgiRequestSubmitterSrvc = _rgiRequestSubmitterSrvc_;
        rgiUrlCheckSrvc = _rgiUrlCheckSrvc_;
    }));

    describe('#isReal', function() {
        var url = 'http://google.com', PROMISE = 'promise',
            requestSubmitterGetSpy, $requestSubmitterGetStub, deferredSpy, $qDeferStub;

        beforeEach(function() {
            deferredSpy = sinon.spy();
        });

        var setRequestSubmitter = function(callback) {
            requestSubmitterGetSpy = sinon.spy(function() {
                return {then: callback};
            });
            $requestSubmitterGetStub = sinon.stub(rgiRequestSubmitterSrvc, 'get', requestSubmitterGetSpy);
        };

        var checkDeferred = function(expectedMethod, expectedArgument) {
            $qDeferStub = sinon.stub($q, 'defer', function() {
                var deferred = {promise: PROMISE};
                deferred[expectedMethod] = deferredSpy;
                return deferred;
            });

            rgiUrlCheckSrvc.isReal(url).should.be.equal(PROMISE);
            deferredSpy.withArgs(expectedArgument).called.should.be.equal(true);
        };

        it('rejects the deferred with error message on error', function () {
            setRequestSubmitter(function(callbackSuccess, callbackFailure) {
                callbackFailure();
            });
            checkDeferred('reject', 'failed');
        });

        it('rejects the deferred with false if the response data format is incorrect', function () {
            setRequestSubmitter(function(callbackSuccess) {
                callbackSuccess({data: {}});
            });
            checkDeferred('reject', false);
        });

        it('resolves the deferred with true on success', function () {
            setRequestSubmitter(function(callbackSuccess) {
                callbackSuccess({data: {results: 'ok'}});
            });
            checkDeferred('resolve', true);
        });

        afterEach(function() {
            requestSubmitterGetSpy.withArgs('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' +
            encodeURIComponent(url) + '%22&format=json').called.should.be.equal(true);
            $requestSubmitterGetStub.restore();
            $qDeferStub.restore();
        });
    });
});