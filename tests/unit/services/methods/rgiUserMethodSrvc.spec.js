'use strict';

describe('rgiUserMethodSrvc', function () {
    beforeEach(module('app'));

    var $q, rgiUserMethodSrvc, rgiHttpResponseProcessorSrvc, rgiUserSrvc;
    var rgiUserSrvcStub, $qDeferStub, $qDeferSpy, expectedPromise;

    var getProcessingFailureTestSuite = function(serviceMethod, resourceMethod, getArgument) {
        return function() {
            var
                httpResponseProcessorStubs = {},
                httpResponseProcessorSpies = {},
                MESSAGE = 'MESSAGE',
                REJECTED_RESPONSE = {data: ''},
                RESULT;

            beforeEach(function() {
                expectedPromise = 'NEGATIVE';

                $qDeferSpy = sinon.spy();
                $qDeferStub = sinon.stub($q, 'defer', function() {
                    return {
                        reject: $qDeferSpy,
                        promise: expectedPromise
                    };
                });

                if(resourceMethod) {
                    rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, resourceMethod, function() {
                        return {
                            then: function(uselessCallbackPositive, callbackNegative) {
                                callbackNegative(REJECTED_RESPONSE);
                            }
                        };
                    });
                }

                httpResponseProcessorSpies.getMessage = sinon.spy(function() {
                    return MESSAGE;
                });
                httpResponseProcessorStubs.getMessage =
                    sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage', httpResponseProcessorSpies.getMessage);

                httpResponseProcessorSpies.handle = sinon.spy();
                httpResponseProcessorStubs.handle =
                    sinon.stub(rgiHttpResponseProcessorSrvc, 'handle', httpResponseProcessorSpies.handle);

                RESULT = rgiUserMethodSrvc[serviceMethod](getArgument(expectedPromise, REJECTED_RESPONSE));
            });

            it('returns a promise', function () {
                RESULT.should.be.equal(expectedPromise);
            });

            it('rejects the deferred in case of failure', function () {
                $qDeferSpy.should.have.been.calledWith(MESSAGE);
            });

            it('calls response processing', function () {
                httpResponseProcessorSpies.handle.should.have.been.calledWith(REJECTED_RESPONSE);
            });

            afterEach(function () {
                for(var stubName in httpResponseProcessorStubs) {
                    if(httpResponseProcessorStubs.hasOwnProperty(stubName)) {
                        httpResponseProcessorStubs[stubName].restore();
                    }
                }
            });
        };
    };

    beforeEach(inject(function (_rgiUserMethodSrvc_, _$q_, _rgiUserSrvc_, _rgiHttpResponseProcessorSrvc_) {
        $q = _$q_;
        rgiUserSrvc = _rgiUserSrvc_;
        rgiUserMethodSrvc = _rgiUserMethodSrvc_;
        rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
    }));

    describe('#createUser', function () {
        describe('PROCESSED SUCCESSFULLY', function() {
            it('resolves the deferred in positive case', function () {
                expectedPromise = 'POSITIVE';
                var RESOLVED_RESPONSE = {data: {}};

                rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$save', function() {
                    return {
                        then: function(callback) {
                            callback(RESOLVED_RESPONSE);
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

                rgiUserMethodSrvc.createUser([expectedPromise]).should.be.equal(expectedPromise);
                $qDeferSpy.called.should.be.equal(true);
            });

            it('rejects the deferred if an error is got', function () {
                expectedPromise = 'NEGATIVE';
                var REJECTED_RESPONSE = {
                    data: {reason: 'REJECT'}
                };

                rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$save', function() {
                    return {
                        then: function(callbackPositive) {
                            callbackPositive(REJECTED_RESPONSE);
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

                rgiUserMethodSrvc.createUser([expectedPromise]).should.be.equal(expectedPromise);
                $qDeferSpy.should.have.been.calledWith(REJECTED_RESPONSE.data.reason);
            });
        });

        describe('PROCESSING FAILURE', getProcessingFailureTestSuite('createUser', '$save', function (promise) {
            return [promise];
        }));

        afterEach(function () {
            $qDeferStub.restore();
            rgiUserSrvcStub.restore();
        });
    });

    describe('#deleteUser', function () {
        describe('PROCESSED SUCCESSFULLY', function() {
            it('resolves the deferred in positive case', function () {
                expectedPromise = 'POSITIVE';
                var RESOLVED_RESPONSE = {data: {}};

                rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$delete', function() {
                    return {
                        then: function(callback) {
                            callback(RESOLVED_RESPONSE);
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

                rgiUserMethodSrvc.deleteUser([expectedPromise]).should.be.equal(expectedPromise);
                $qDeferSpy.called.should.be.equal(true);
            });

            it('resolves the deferred in positive case', function () {
                expectedPromise = 'NEGATIVE';
                var REJECTED_RESPONSE = {
                    data: {reason: 'REJECT_INSERTION'}
                };

                rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$delete', function() {
                    return {
                        then: function(callback) {
                            callback(REJECTED_RESPONSE);
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

                rgiUserMethodSrvc.deleteUser([expectedPromise]).should.be.equal(expectedPromise);
                $qDeferSpy.should.have.been.calledWith(REJECTED_RESPONSE.data.reason);
            });
        });

        describe('PROCESSING FAILURE', getProcessingFailureTestSuite('deleteUser', '$delete', function (promise) {
            return [promise];
        }));

        afterEach(function () {
            $qDeferStub.restore();
            rgiUserSrvcStub.restore();
        });
    });

    describe('#updateUser', function () {
        describe('PROCESSED SUCCESSFULLY', function() {
            it('resolves the deferred in positive case', function () {
                expectedPromise = 'POSITIVE';
                var RESOLVED_RESPONSE = {data: {}};

                $qDeferSpy = sinon.spy();
                $qDeferStub = sinon.stub($q, 'defer', function () {
                    return {
                        resolve: $qDeferSpy,
                        promise: expectedPromise
                    };
                });

                rgiUserMethodSrvc.updateUser({
                    $update: function () {
                        return {
                            then: function (callback) {
                                callback(RESOLVED_RESPONSE);
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
                $qDeferStub = sinon.stub($q, 'defer', function () {
                    return {
                        reject: $qDeferSpy,
                        promise: expectedPromise
                    };
                });

                rgiUserMethodSrvc.updateUser({
                    $update: function () {
                        return {
                            then: function (callback) {
                                callback({data: {reason: REASON}});
                            }
                        };
                    }
                }).should.be.equal(expectedPromise);

                $qDeferSpy.should.have.been.calledWith(REASON);
            });
        });

        describe('PROCESSING FAILURE', getProcessingFailureTestSuite('updateUser', undefined, function(promise, response) {
            return {
                $update: function () {
                    return {
                        then: function (callback, callbackNegative) {
                            callbackNegative(response);
                        }
                    };
                }
            };
        }));

        afterEach(function () {
            $qDeferStub.restore();
        });
    });

});
