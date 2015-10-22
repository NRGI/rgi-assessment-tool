'use strict';
/*jshint -W079 */

var describe, beforeEach, it, inject, expect;

describe('rgiUploadMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiUploadMethodSrvc;
    var $q, rgiUploadSrvc;

    beforeEach(inject(function (_rgiUploadMethodSrvc_, _$q_, _rgiUploadSrvc_) {
        $q = _$q_;
        rgiUploadMethodSrvc = _rgiUploadMethodSrvc_;
        rgiUploadSrvc = _rgiUploadSrvc_;
    }));

    describe('#upload', function () {
        var $qDeferStub, $qDeferSpy;
        var rgiUploadSrvc$saveStub, expectedPromise;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiUploadSrvc$saveStub = sinon.stub(rgiUploadSrvc.prototype, '$save', function() {
                return {
                    then: function(callbackPositive) {
                        callbackPositive();
                    }
                };
            });

            rgiUploadMethodSrvc.upload().should.be.equal(expectedPromise);
            $qDeferSpy.called.should.be.equal(true);
        });

        it('rejects the deferred in negative case', function () {
            expectedPromise = 'NEGATIVE';
            var REASON = 'REASON';

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    reject: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiUploadSrvc$saveStub = sinon.stub(rgiUploadSrvc.prototype, '$save', function() {
                return {
                    then: function(uselessCallbackPositive, callbackNegative) {
                        callbackNegative({
                            data: {reason: REASON}
                        });
                    }
                };
            });

            rgiUploadMethodSrvc.upload().should.be.equal(expectedPromise);
            $qDeferSpy.should.have.been.calledWith(REASON);
        });

        afterEach(function () {
            $qDeferStub.restore();
            rgiUploadSrvc$saveStub.restore();
        });
    });

});