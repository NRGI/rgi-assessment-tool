'use strict';

var describe, beforeEach, it, inject, expect;

describe('rgiQuestionMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiQuestionMethodSrvc;
    var $q, rgiQuestionSrvc;
    var $qDeferStub, $qDeferSpy, expectedPromise;

    beforeEach(inject(function (_rgiQuestionMethodSrvc_, _$q_, _rgiQuestionSrvc_) {
        $q = _$q_;
        rgiQuestionSrvc = _rgiQuestionSrvc_;
        rgiQuestionMethodSrvc = _rgiQuestionMethodSrvc_;
    }));

    describe('#insertQuestionSet', function () {
        var rgiQuestionSrvcStub;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            rgiQuestionSrvcStub = sinon.stub(rgiQuestionSrvc.prototype, '$save', function() {
                return {
                    then: function(callback) {
                        callback();
                    }
                };
            });

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiQuestionMethodSrvc.insertQuestionSet([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.called.should.be.equal(true);
        });

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'NEGATIVE';
            var REJECT_INSERTION_RESPONSE = {
                data: {reason: 'REJECT_INSERTION'}
            };

            rgiQuestionSrvcStub = sinon.stub(rgiQuestionSrvc.prototype, '$save', function() {
                return {
                    then: function(callbackPositive, callbackNegative) {
                        callbackNegative(REJECT_INSERTION_RESPONSE);
                    }
                };
            });

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    reject: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiQuestionMethodSrvc.insertQuestionSet([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.should.have.been.calledWith(REJECT_INSERTION_RESPONSE.data.reason);
        });

        afterEach(function () {
            $qDeferStub.restore();
            rgiQuestionSrvcStub.restore();
        });
    });

    describe('#deleteQuestion', function () {
        var rgiQuestionSrvcStub;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            rgiQuestionSrvcStub = sinon.stub(rgiQuestionSrvc.prototype, '$delete', function() {
                return {
                    then: function(callback) {
                        callback();
                    }
                };
            });

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiQuestionMethodSrvc.deleteQuestion([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.called.should.be.equal(true);
        });

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'NEGATIVE';
            var REJECT_RESPONSE = {
                data: {reason: 'REJECT_INSERTION'}
            };

            rgiQuestionSrvcStub = sinon.stub(rgiQuestionSrvc.prototype, '$delete', function() {
                return {
                    then: function(callbackPositive, callbackNegative) {
                        callbackNegative(REJECT_RESPONSE);
                    }
                };
            });

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    reject: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiQuestionMethodSrvc.deleteQuestion([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.should.have.been.calledWith(REJECT_RESPONSE.data.reason);
        });

        afterEach(function () {
            $qDeferStub.restore();
            rgiQuestionSrvcStub.restore();
        });
    });

    describe('#updateQuestion', function () {
        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiQuestionMethodSrvc.updateQuestion({
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

            rgiQuestionMethodSrvc.updateQuestion({
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