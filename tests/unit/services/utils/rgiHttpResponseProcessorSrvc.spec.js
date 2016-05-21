'use strict';

describe('rgiHttpResponseProcessorSrvc', function () {
    var rgiHttpResponseProcessorSrvc,
        $location, rgiIdentitySrvc, rgiNotifier;

    beforeEach(module('app'));

    beforeEach(inject(function(
        _rgiHttpResponseProcessorSrvc_,
        _$location_,
        _rgiIdentitySrvc_,
        _rgiNotifier_
    ) {
        rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
        $location = _$location_;
        rgiIdentitySrvc = _rgiIdentitySrvc_;
        rgiNotifier = _rgiNotifier_;
    }));

    describe('HANDLERS', function() {
        var handler, alternativeMessage = 'ALTERNATIVE MESSAGE', dummyResponse = {status: 'DUMMY'},
            mocks = {}, spies = {}, stubs = {};

        beforeEach(function() {
            rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();
            mocks.notifier = sinon.mock(rgiNotifier);

            spies.httpResponseProcessorHandle = sinon.spy(rgiHttpResponseProcessorSrvc.handle);
            stubs.httpResponseProcessorHandle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle',
                spies.httpResponseProcessorHandle);

            stubs.httpResponseProcessorHandle = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage',
                function(response, alternativeMessage) {
                    return alternativeMessage;
                });
        });

        describe('#getDefaultRepeatedHandler', function() {
            beforeEach(function() {
                handler = rgiHttpResponseProcessorSrvc.getDefaultHandler(alternativeMessage);
            });

            it('handles the response as many times as it is called', function() {
                handler(dummyResponse);
                handler(dummyResponse);
                spies.httpResponseProcessorHandle.withArgs(dummyResponse).calledTwice.should.be.equal(true);
            });

            it('shows the error message as many times as it is called', function() {
                mocks.notifier.expects('error').withArgs(alternativeMessage).twice(true);
                handler(dummyResponse);
                handler(dummyResponse);
            });
        });

        describe('#getNotRepeatedHandler', function() {
            beforeEach(function() {
                handler = rgiHttpResponseProcessorSrvc.getNotRepeatedHandler(alternativeMessage);
            });

            it('handles the response only once', function() {
                handler(dummyResponse);
                handler(dummyResponse);
                spies.httpResponseProcessorHandle.withArgs(dummyResponse).calledOnce.should.be.equal(true);
            });

            it('shows the error message only once', function() {
                mocks.notifier.expects('error').withArgs(alternativeMessage).once(true);
                handler(dummyResponse);
                handler(dummyResponse);
            });
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].verify();
                mocks[mockName].restore();
            });

            Object.keys(stubs).forEach(function(stubName) {
                stubs[stubName].restore();
            });
        });
    });

    describe('#getMessage', function() {
        it('returns an message for forbidden status', function() {
            rgiHttpResponseProcessorSrvc.getMessage({status: 403}).should.be.equal('Please, re-login');
        });

        describe('UNKNOWN STATUS', function() {
            it('returns the submitted message', function() {
                var message = 'MESSAGE';
                rgiHttpResponseProcessorSrvc.getMessage({status: 'not defined status', data: {reason: 'REASON'}}, message)
                    .should.be.equal(message);
            });

            it('returns the provided reason', function() {
                var reason = 'REASON';
                rgiHttpResponseProcessorSrvc.getMessage({status: 'not defined status', data: {reason: reason}})
                    .should.be.equal(reason);
            });

            it('returns the provided data if no reason is provided', function() {
                var reason = 'REASON';
                rgiHttpResponseProcessorSrvc.getMessage({status: 'not defined status', data: reason})
                    .should.be.equal(reason);
            });

            it('returns the default message if no error message provided', function() {
                rgiHttpResponseProcessorSrvc.getMessage({status: 'not defined status', data: ''})
                    .should.be.equal('Unknown error occurred');
            });
        });
    });

    describe('#handle', function() {
        describe('AUTHENTICATION', function() {
            var currentUserBackup, currentUserDummy = 'DUMMY USER';

            it('resets current user on 403: Forbidden', function() {
                currentUserBackup = angular.copy(rgiIdentitySrvc.currentUser);
                rgiIdentitySrvc.currentUser = currentUserDummy;

                rgiHttpResponseProcessorSrvc.handle({status: 403});

                should.not.exist(rgiIdentitySrvc.currentUser);
                rgiIdentitySrvc.currentUser = currentUserBackup;
            });

            it('leaves the current user data unmodified if another status comes', function() {
                currentUserBackup = angular.copy(rgiIdentitySrvc.currentUser);
                rgiIdentitySrvc.currentUser = currentUserDummy;

                rgiHttpResponseProcessorSrvc.handle({status: 'not processed status'});

                rgiIdentitySrvc.currentUser.should.be.equal(currentUserDummy);
                rgiIdentitySrvc.currentUser = currentUserBackup;
            });

            it('increases the number of handled HTTP failures', function() {
                var handledFailuresNumber = rgiHttpResponseProcessorSrvc.getHandledFailuresNumber();
                rgiHttpResponseProcessorSrvc.handle({status: 200});
                rgiHttpResponseProcessorSrvc.getHandledFailuresNumber().should.be.equal(handledFailuresNumber + 1);
            });
        });

        describe('NAVIGATION', function() {
            var $locationMock = {};

            beforeEach(function() {
                $locationMock = sinon.mock($location);
            });

            it('navigates to the home page on 403: Forbidden', function() {
                $locationMock.expects('path').withArgs('/');
                rgiHttpResponseProcessorSrvc.handle({status: 403});
            });

            it('does nothing if another status comes', function() {
                $locationMock.expects('path').never();
                rgiHttpResponseProcessorSrvc.handle({status: 'not processed status'});
            });

            afterEach(function() {
                $locationMock.verify();
                $locationMock.restore();
            });
        });
    });

    describe('#resetHandledFailuresNumber', function() {
        it('sets to 0 the number of handled HTTP failures', function() {
            rgiHttpResponseProcessorSrvc.handle({status: 200});
            rgiHttpResponseProcessorSrvc.getHandledFailuresNumber().should.be.gt(0);
            rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();
            rgiHttpResponseProcessorSrvc.getHandledFailuresNumber().should.be.equal(0);
        });
    });
});
