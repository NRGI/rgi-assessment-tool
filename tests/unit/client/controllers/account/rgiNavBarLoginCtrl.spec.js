'use strict';

describe('rgiNavBarLoginCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiAuthSrvc, rgiAssessmentSrvc, rgiNotifier;
    var mocks = {}, stubs = {};

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiAssessmentSrvc_, _rgiAuthSrvc_, _rgiNotifier_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiAuthSrvc = _rgiAuthSrvc_;
            rgiNotifier = _rgiNotifier_;

            mocks.notifier = sinon.mock(rgiNotifier);
            $controller('rgiNavBarLoginCtrl', {$scope: $scope});
        }
    ));

    describe('#recoverPassword', function () {
        it('redirects to a defined URI', function() {
            mocks.$location = sinon.mock($location);
            mocks.$location.expects('path').withArgs('/recover-password');
            $scope.recoverPassword();
        });
    });

    describe('#signout', function () {
        beforeEach(function () {
            mocks.notifier.expects('notify').withArgs('You have successfully signed out!');
            mocks.$location = sinon.mock($location);
            mocks.$location.expects('path').withArgs('/');

            mocks.rgiAuthSrvc = sinon.mock(rgiAuthSrvc);
            mocks.rgiAuthSrvc.expects('logoutUser').
                returns({
                    then: function (callback) {
                        callback();
                    }
                });

            $scope.signout();
        });

        it('resets the username & password', function () {
            $scope.username.should.be.equal('');
            $scope.password.should.be.equal('');
        });
    });

    describe('#signin', function () {
        var CORRECT_CREDENTIALS = {username: 'EXISTING_USER', password: 'CORRECT_PASSWORD'};

        beforeEach(function () {
            stubs.authAuthenticateUser = sinon.stub(rgiAuthSrvc, 'authenticateUser', function(username, password) {
                return {
                    then: function(callback) {
                        callback((username === CORRECT_CREDENTIALS.username) && (password === CORRECT_CREDENTIALS.password));
                    }
                };
            });
        });

        describe('Empty credentials', function () {
            it('shows a notification message', function () {
                mocks.notifier.expects('error').withArgs('You must supply a Username and Password!');
                $scope.signin('', '');
            });
        });

        describe('Authentication failure', function () {
            describe('NOTIFICATIONS', function() {
                var ERROR_MESSAGE = 'error message',
                    checkNotification = function(description, errorMessage, expectedNotification) {
                        it(description, function () {
                            stubs.authGetError = sinon.stub(rgiAuthSrvc, 'getError', function() {
                                return errorMessage;
                            });

                            mocks.notifier.expects('error').withArgs(expectedNotification);
                            $scope.signin('NON-EXISTING-USER', 'INCORRECT-PASSWORD');
                        });
                    };

                checkNotification('shows a default notification message if no error message is set', undefined,
                    'Username / Password combination is incorrect!');

                checkNotification('shows the notification message which is set', ERROR_MESSAGE, ERROR_MESSAGE);
            });

            it('clears the version list', function () {
                $scope.signin('NON-EXISTING-USER', 'INCORRECT-PASSWORD');
                $scope.versions.length.should.be.equal(0);
            });
        });

        describe('Authentication success', function () {
            beforeEach(function () {
                stubs.assessmentQuery = sinon.stub(rgiAssessmentSrvc, 'query', function(useless, callback) {
                    callback([
                        {year: 2010, version: 'the social network'},
                        {year: 2010, version: 'the social network'},
                        {year: 1995, version: 'the pirates of silicon valley'}
                    ]);
                });

                mocks.notifier.expects('notify').withArgs('You have successfully signed in!');
                $scope.signin(CORRECT_CREDENTIALS.username, CORRECT_CREDENTIALS.password);
            });
        });
    });

    afterEach(function () {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });

        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].verify();
            mocks[mockName].restore();
        });
    });
});
