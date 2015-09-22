'use strict';

var describe, beforeEach, it, inject, expect;

describe('rgiUserMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiUserMethodSrvc;
    var $q, rgiUserSrvc;
    var $qDeferStub, $qDeferSpy, expectedPromise;

    beforeEach(inject(function (_rgiUserMethodSrvc_, _$q_, _rgiUserSrvc_) {
        $q = _$q_;
        rgiUserSrvc = _rgiUserSrvc_;
        rgiUserMethodSrvc = _rgiUserMethodSrvc_;
    }));

    describe('#createUser', function () {
        var rgiUserSrvcStub;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$save', function() {
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

            rgiUserMethodSrvc.createUser([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.called.should.be.equal(true);
        });

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'NEGATIVE';
            var REJECT_RESPONSE = {
                data: {reason: 'REJECT'}
            };

            rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$save', function() {
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

            rgiUserMethodSrvc.createUser([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.should.have.been.calledWith(REJECT_RESPONSE.data.reason);
        });

        afterEach(function () {
            $qDeferStub.restore();
            rgiUserSrvcStub.restore();
        });
    });

    describe('#deleteUser', function () {
        var rgiUserSrvcStub;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$delete', function() {
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

            rgiUserMethodSrvc.deleteUser([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.called.should.be.equal(true);
        });

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'NEGATIVE';
            var REJECT_RESPONSE = {
                data: {reason: 'REJECT_INSERTION'}
            };

            rgiUserSrvcStub = sinon.stub(rgiUserSrvc.prototype, '$delete', function() {
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

            rgiUserMethodSrvc.deleteUser([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.should.have.been.calledWith(REJECT_RESPONSE.data.reason);
        });

        afterEach(function () {
            $qDeferStub.restore();
            rgiUserSrvcStub.restore();
        });
    });

    describe('#updateUser', function () {
        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiUserMethodSrvc.updateUser({
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

            rgiUserMethodSrvc.updateUser({
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