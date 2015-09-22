'use strict';
/*jshint -W030 */

var describe, beforeEach, it, inject, expect;

describe('rgiRequestSubmitterSrvc', function () {
    var rgiRequestSubmitterSrvc, $http, $q;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiRequestSubmitterSrvc_, _$http_, _$q_) {
        $http = _$http_;
        $q = _$q_;
        rgiRequestSubmitterSrvc = _rgiRequestSubmitterSrvc_;
    }));

    describe('#submit', function() {
        var uri = '/uri', data = 'DATA', promise = 'PROMISE', response = 'RESPONSE',
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
                };
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
                };
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
            rgiRequestSubmitterSrvc.submit(uri, data).should.be.equal(promise);

            if(deferredArgs) {
                deferredSpy.withArgs(deferredArgs).called.should.be.equal(true);
            } else {
                deferredSpy.called.should.be.equal(true);
            }

            $httpPostSpy.withArgs(uri, data).called.should.be.equal(true);

            $httpPostStub.restore();
            $qDeferStub.restore();
        });
    });
});