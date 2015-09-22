'use strict';

var describe, beforeEach, it, inject, expect;

describe('rgiAnswerMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiAnswerMethodSrvc;
    var $q, rgiAnswerSrvc;

    beforeEach(inject(function (_rgiAnswerMethodSrvc_, _$q_, _rgiAnswerSrvc_) {
        $q = _$q_;
        rgiAnswerSrvc = _rgiAnswerSrvc_;
        rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
    }));

    describe('#updateAnswer', function () {
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

            rgiAnswerMethodSrvc.updateAnswer({
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

            rgiAnswerMethodSrvc.updateAnswer({
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

    describe('#updateAnswerSet', function () {
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

            rgiAnswerMethodSrvc.updateAnswerSet([
                {
                    $update: function() {
                        return {
                            then: function(callbackPositive) {
                                callbackPositive();
                            }
                        };
                    }
                },
                {
                    $update: function() {
                        return {
                            then: function(callbackPositive) {
                                callbackPositive();
                            }
                        };
                    }
                }
            ]).should.be.equal(expectedPromise);

            sinon.assert.calledTwice($qDeferSpy);
        });

        it('rejects the deferred in negative case', function () {
            expectedPromise = 'NEGATIVE';
            var REASON1 = 'REASON1';
            var REASON2 = 'REASON2';

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    reject: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiAnswerMethodSrvc.updateAnswerSet([
                {
                    $update: function() {
                        return {
                            then: function(uselessCallbackPositive, callbackNegative) {
                                callbackNegative({
                                    data: {reason: REASON1}
                                });
                            }
                        };
                    }
                },
                {
                    $update: function() {
                        return {
                            then: function(uselessCallbackPositive, callbackNegative) {
                                callbackNegative({
                                    data: {reason: REASON2}
                                });
                            }
                        };
                    }
                }
            ]).should.be.equal(expectedPromise);

            $qDeferSpy.should.have.been.calledWith(REASON1);
            $qDeferSpy.should.have.been.calledWith(REASON2);
        });

        afterEach(function () {
            $qDeferStub.restore();
        });
    });

    describe('#insertAnswerSet', function () {
        var $qDeferStub, rgiAnswerSrvcStub, $qDeferSpy, expectedPromise;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            rgiAnswerSrvcStub = sinon.stub(rgiAnswerSrvc.prototype, '$save', function() {
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

            rgiAnswerMethodSrvc.insertAnswerSet([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.called.should.be.equal(true);
        });

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'NEGATIVE';
            var REJECT_INSERTION_RESPONSE = {
                data: {reason: 'REJECT_INSERTION'}
            };

            rgiAnswerSrvcStub = sinon.stub(rgiAnswerSrvc.prototype, '$save', function() {
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

            rgiAnswerMethodSrvc.insertAnswerSet([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.should.have.been.calledWith(REJECT_INSERTION_RESPONSE.data.reason);
        });

        afterEach(function () {
            $qDeferStub.restore();
            rgiAnswerSrvcStub.restore();
        });
    });

});