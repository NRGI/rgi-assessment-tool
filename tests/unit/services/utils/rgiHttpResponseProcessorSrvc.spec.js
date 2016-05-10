'use strict';

describe('rgiHttpResponseProcessorSrvc', function () {
    var rgiHttpResponseProcessorSrvc,
        $location, rgiIdentitySrvc;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiHttpResponseProcessorSrvc_, _$location_, _rgiIdentitySrvc_) {
        rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
        $location = _$location_;
        rgiIdentitySrvc = _rgiIdentitySrvc_;
    }));

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
});
