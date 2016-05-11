'use strict';

describe('rgiAnswerMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiAnswerMethodSrvc;
    var $q, rgiAnswerSrvc, rgiHttpResponseProcessorSrvc;
    var $qDeferStub, $qDeferSpy, expectedPromise;

    beforeEach(inject(function (_rgiAnswerMethodSrvc_, _$q_, _rgiAnswerSrvc_, _rgiHttpResponseProcessorSrvc_) {
        $q = _$q_;
        rgiAnswerSrvc = _rgiAnswerSrvc_;
        rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
        rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
    }));

    var checkFailureCase = function(performMainAction, dummyResponses) {
        describe('REJECT', function() {
            var actualPromise, httpResponseHandleSpy, stubs = {};

            beforeEach(function() {
                expectedPromise = 'NEGATIVE';

                $qDeferSpy = sinon.spy();
                $qDeferStub = sinon.stub($q, 'defer', function() {
                    return {
                        reject: $qDeferSpy,
                        promise: expectedPromise
                    };
                });

                httpResponseHandleSpy = sinon.spy();
                stubs.handle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle', httpResponseHandleSpy);
                stubs.getMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage', function(response, message) {
                    return message;
                });

                actualPromise = performMainAction(expectedPromise);
            });

            it('submits the failure response for further processing', function () {
                dummyResponses.forEach(function(dummyResponse) {
                    httpResponseHandleSpy.withArgs(dummyResponse).called.should.be.equal(true);
                });
            });

            it('returns a promise', function () {
                actualPromise.should.be.equal(expectedPromise);
            });

            it('rejects the deferred in negative case', function () {
                $qDeferSpy.should.have.been.calledWith('Save answer failure');
            });

            afterEach(function() {
                Object.keys(stubs).forEach(function(stubName) {
                    stubs[stubName].restore();
                });
            });
        });
    };

    describe('#updateAnswer', function () {
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

        var dummyResponse = 'RESPONSE';

        checkFailureCase(function() {
            return rgiAnswerMethodSrvc.updateAnswer({
                $update: function() {
                    return {
                        then: function(uselessCallbackPositive, callbackNegative) {
                            callbackNegative(dummyResponse);
                        }
                    };
                }
            });
        }, [dummyResponse]);
    });

    describe('#updateAnswerSet', function () {
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

        var dummyResponse1 = 'RESPONSE1', dummyResponse2 = 'RESPONSE2';

        checkFailureCase(function() {
            return rgiAnswerMethodSrvc.updateAnswerSet([
                {
                    $update: function() {
                        return {
                            then: function(uselessCallbackPositive, callbackNegative) {
                                callbackNegative(dummyResponse1);
                            }
                        };
                    }
                },
                {
                    $update: function() {
                        return {
                            then: function(uselessCallbackPositive, callbackNegative) {
                                callbackNegative(dummyResponse2);
                            }
                        };
                    }
                }
            ]);
        }, [dummyResponse1, dummyResponse2]);
    });

    describe('#insertAnswerSet', function () {
        var rgiAnswerSrvcStub;

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

        describe('reject insert', function() {
            var REJECT_INSERTION_RESPONSE = 'REJECT_INSERTION';

            beforeEach(function() {
                rgiAnswerSrvcStub = sinon.stub(rgiAnswerSrvc.prototype, '$save', function() {
                    return {
                        then: function(callbackPositive, callbackNegative) {
                            callbackNegative(REJECT_INSERTION_RESPONSE);
                        }
                    };
                });
            });

            checkFailureCase(function(expectedPromise) {
                return rgiAnswerMethodSrvc.insertAnswerSet([expectedPromise]);
            }, [REJECT_INSERTION_RESPONSE]);
        });

        afterEach(function () {
            rgiAnswerSrvcStub.restore();
        });
    });

    afterEach(function () {
        $qDeferStub.restore();
    });
});
