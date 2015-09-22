'use strict';

var describe, beforeEach, it, inject, expect;

describe('rgiDocumentMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiDocumentMethodSrvc;
    var $q;

    beforeEach(inject(function (_rgiDocumentMethodSrvc_, _$q_) {
        $q = _$q_;
        rgiDocumentMethodSrvc = _rgiDocumentMethodSrvc_;
    }));

    describe('#updateDocument', function () {
        var $qDeferStub, $qDeferSpy, expectedPromise;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiDocumentMethodSrvc.updateDocument({
                $update: function() {
                    return {
                        then: function(callbackPositive) {
                            callbackPositive();
                        }
                    };
                }
            }).should.be.equal(expectedPromise);

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

            rgiDocumentMethodSrvc.updateDocument({
                $update: function() {
                    return {
                        then: function(uselessCallbackPositive, callbackNegative) {
                            callbackNegative({
                                data: {reason: REASON}
                            });
                        }
                    };
                }
            }).should.be.equal(expectedPromise);

            $qDeferSpy.should.have.been.calledWith(REASON);
        });

        afterEach(function () {
            $qDeferStub.restore();
        });
    });

});