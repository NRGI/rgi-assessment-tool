'use strict';

describe('rgiUtilsSrvc', function () {
    var rgiUtilsSrvc,
        $http, $q;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiUtilsSrvc_, _$http_, _$q_) {
        rgiUtilsSrvc = _rgiUtilsSrvc_;
        $http = _$http_;
        $q = _$q_;
    }));

    describe('#flagCheck', function() {
        it('returns `false` if the submitted flag list is empty', function() {
            rgiUtilsSrvc.flagCheck([]).should.be.equal(false);
        });

        it('returns `false` if there are no flags with set `addressed` field', function() {
            rgiUtilsSrvc.flagCheck([{field: 'value'}]).should.be.equal(false);
        });

        it('returns `false` if there are no flags with `addressed` field set to `false`', function() {
            rgiUtilsSrvc.flagCheck([{addressed: true}]).should.be.equal(false);
        });

        it('returns `false` if the flag `addressed` field is set to ""', function() {
            rgiUtilsSrvc.flagCheck([{addressed: ''}]).should.be.equal(false);
        });

        it('returns `false` if the flag `addressed` field is set to 0', function() {
            rgiUtilsSrvc.flagCheck([{addressed: 0}]).should.be.equal(false);
        });

        it('returns `false` if the flag `addressed` field is set to null', function() {
            rgiUtilsSrvc.flagCheck([{addressed: null}]).should.be.equal(false);
        });

        it('returns `false` if the flag `addressed` field is set to 0', function() {
            rgiUtilsSrvc.flagCheck([{addressed: undefined}]).should.be.equal(false);
        });

        it('returns `true` if at least one flag has `addressed` field set to `false`', function() {
            rgiUtilsSrvc.flagCheck([{addressed: true}, {addressed: false}]).should.be.equal(true);
        });
    });

    describe('#zeroFill', function() {
        it('add "0" characters before a number to supplement it to defined length', function() {
            rgiUtilsSrvc.zeroFill(5, 2).should.be.equal('05');
        });

        it('simply converts the number to a string if it has enough length', function() {
            rgiUtilsSrvc.zeroFill(113, 3).should.be.equal('113');
        });

        it('does not truncate the number if it exceed the defined length', function() {
            rgiUtilsSrvc.zeroFill(113, 2).should.be.equal('113');
        });
    });

    describe('#isURLReal', function() {
        var PROMISE = 'PROMISE', URL = 'http://google.com/', spies = {}, stubs = {},
            set$httpGetStub = function(callback) {
                spies.$httpGet = sinon.spy(function() {
                    return {then: callback};
                });

                stubs.$httpGet = sinon.stub($http, 'get', spies.$httpGet);
            };

        beforeEach(function() {
            spies.deferredReject = sinon.spy();
            spies.deferredResolve = sinon.spy();

            stubs.$qDefer = sinon.stub($q, 'defer', function() {
                return {
                    promise: PROMISE,
                    reject: spies.deferredReject,
                    resolve: spies.deferredResolve
                };
            });
        });

        it('resolves the promise with `true` if results are found', function() {
            set$httpGetStub(function(callback) {
                callback({data: {query: {results: true}}});
            });

            rgiUtilsSrvc.isURLReal(URL);
            spies.deferredResolve.withArgs(true).called.should.be.equal(true);
        });

        it('rejects the promise with `false` if results are not found', function() {
            set$httpGetStub(function(callback) {
                callback({data: {query: {}}});
            });

            rgiUtilsSrvc.isURLReal(URL);
            spies.deferredReject.withArgs(false).called.should.be.equal(true);
        });

        it('rejects the promise with `undefined` if the request is failed', function() {
            set$httpGetStub(function(uselessCallbackPositive, callbackNegative) {
                callbackNegative();
            });

            rgiUtilsSrvc.isURLReal(URL);
            spies.deferredReject.withArgs(undefined).called.should.be.equal(true);
        });

        afterEach(function() {

            stubs.$httpGet.restore();
            stubs.$qDefer.restore();
        });
    });
});
