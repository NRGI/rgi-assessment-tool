'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, it, inject, expect;

describe('rgiResetPasswordSrvc', function () {
    var rgiResetPasswordSrvc, $http, $q;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiResetPasswordSrvc_, _$http_, _$q_) {
        $http = _$http_;
        $q = _$q_;
        rgiResetPasswordSrvc = _rgiResetPasswordSrvc_;
    }));

    describe('#reset', function() {
        var token = 'TOKEN', password = 'PASSWORD', promise = 'PROMISE', response = 'RESPONSE',
            $httpPostSpy, $httpPostStub,
            deferredArgs, deferredSpy, $qDeferStub;

        beforeEach(function() {
            deferredSpy = sinon.spy();
        });

        it('sends a POST request to a given address', function () {
            $httpPostSpy = sinon.spy(function() {
                return {
                    then: function(callback) {
                        callback(response);
                    }
                }
            });

            deferredArgs = response;

            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: deferredSpy,
                    promise: promise
                };
            });
        });

        it('does not perform any action, if the request is failed', function () {
            $httpPostSpy = sinon.spy(function() {
                return {
                    then: function(callbackPositive, callbackNegative) {
                        callbackNegative();
                    }
                }
            });

            deferredArgs = undefined;

            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    reject: deferredSpy,
                    promise: promise
                };
            });
        });

        afterEach(function() {
            $httpPostStub = sinon.stub($http, 'post', $httpPostSpy);
            rgiResetPasswordSrvc.reset(token, password).should.be.equal(promise);

            deferredArgs
                ? deferredSpy.withArgs(deferredArgs).called.should.be.equal(true)
                : deferredSpy.called.should.be.equal(true);
            $httpPostSpy.withArgs('/api/reset-password-token/reset', {token: token, password: password}).called.should.be.equal(true);

            $httpPostStub.restore();
            $qDeferStub.restore();
        });
    });
});