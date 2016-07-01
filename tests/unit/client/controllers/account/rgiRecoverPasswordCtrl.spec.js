'use strict';

describe('rgiRecoverPasswordCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiHttpResponseProcessorSrvc, rgiNotifier, rgiResetPasswordSrvc;

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$location_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiNotifier_,
            _rgiResetPasswordSrvc_
        ) {
            $location = _$location_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiResetPasswordSrvc = _rgiResetPasswordSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiRecoverPasswordCtrl', {$scope: $scope});
        }
    ));

    describe('#recoverPassword', function () {
        var rgiNotifierMock,
            executeAndValidateAndRestoreMock = function() {
                $scope.recoverPassword();
                rgiNotifierMock.verify();
                rgiNotifierMock.restore();
            };

        beforeEach(function () {
            rgiNotifierMock = sinon.mock(rgiNotifier);
        });

        describe('INVALID CASE', function() {
            it('shows an error message, if the email is empty', function () {
                $scope.recoverPasswordForm = {email: {$pristine: true}};
                rgiNotifierMock.expects('error').withArgs('The email is incorrect');
            });

            it('shows an error message, if the email is invalid', function () {
                $scope.recoverPasswordForm = {email: {$invalid: true}};
                rgiNotifierMock.expects('error').withArgs('The email is incorrect');
            });

            afterEach(executeAndValidateAndRestoreMock);
        });

        describe('VALID CASE', function() {
            var spies = {}, stubs = {}, $locationMock, extraCheck, response,
                email = 'EMAIL', emailBackup, recoverPasswordFormBackup;

            beforeEach(function () {
                emailBackup = $scope.email;
                recoverPasswordFormBackup = $scope.recoverPasswordForm;
                extraCheck = function() {};

                $scope.recoverPasswordForm = {email: {
                    $invalid: false,
                    $pristine: false
                }};
                $scope.email = email;

                rgiNotifierMock = sinon.mock(rgiNotifier);
                $locationMock = sinon.mock($location);
            });

            describe('NEGATIVE CASE', function() {
                beforeEach(function() {
                    spies.httpResponseProcessorHandle = sinon.spy();
                    stubs.httpResponseProcessorHandle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle',
                        spies.httpResponseProcessorHandle);

                    stubs.httpResponseProcessorGetMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage', function() {
                        return 'An unknown error occurred';
                    });

                    extraCheck = function() {
                        spies.httpResponseProcessorHandle.withArgs(response).called.should.be.equal(true);
                    };
                });

                it('shows an unknown error message', function () {
                    rgiNotifierMock.expects('error').withArgs('An unknown error occurred');
                });

                afterEach(function () {
                    spies.resetPassword = sinon.spy(function() {
                        return {
                            then: function(callbackPositive, callbackNegative) {
                                callbackNegative();
                            }
                        };
                    });
                });
            });

            describe('POSITIVE CASE', function() {
                [
                    {
                        code: 'USER_NOT_FOUND',
                        message: 'The user is not found',
                        case: 'user is not found'
                    },
                    {
                        code: 'SPECIAL_ERROR',
                        message: 'An unknown error occurred',
                        case: 'unknown error occurred'
                    }
                ].forEach(function(error) {
                    it('shows an error message, if ' + error.case, function () {
                        response = {data: {error: error.code}};
                        rgiNotifierMock.expects('error').withArgs(error.message);
                    });
                });

                it('shows a successful notification, if no error occurs', function () {
                    response = {data: {error: undefined}};
                    $locationMock.expects('path').withArgs('/');
                    rgiNotifierMock.expects('notify')
                        .withArgs('An email with instructions to recover your password has been sent to your email address.');
                });

                afterEach(function () {
                    spies.resetPassword = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback(response);
                            }
                        };
                    });
                });
            });

            afterEach(function () {
                stubs.resetPasswordRecover = sinon.stub(rgiResetPasswordSrvc, 'recover', spies.resetPassword);
                executeAndValidateAndRestoreMock();
                $locationMock.verify();
                $locationMock.restore();
                spies.resetPassword.withArgs(email).called.should.be.equal(true);

                Object.keys(stubs).forEach(function(stubName) {
                    stubs[stubName].restore();
                });

                extraCheck();
                $scope.recoverPasswordForm = recoverPasswordFormBackup;
                $scope.email = emailBackup;
            });
        });

    });
});
