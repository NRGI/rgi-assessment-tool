'use strict';

describe('rgiRecoverPasswordCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiNotifier, rgiResetPasswordSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiNotifier_, _rgiResetPasswordSrvc_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            rgiNotifier = _rgiNotifier_;
            rgiResetPasswordSrvc = _rgiResetPasswordSrvc_;
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
            var resetPasswordStub, resetPasswordSpy,
                $locationMock, response, email = 'EMAIL',
                emailBackup, recoverPasswordFormBackup;

            beforeEach(function () {
                emailBackup = $scope.email;
                recoverPasswordFormBackup = $scope.recoverPasswordForm;

                $scope.recoverPasswordForm = {email: {
                    $invalid: false,
                    $pristine: false
                }};
                $scope.email = email;

                rgiNotifierMock = sinon.mock(rgiNotifier);
                $locationMock = sinon.mock($location);
            });

            describe('NEGATIVE CASE', function() {
                it('shows an unknown error message', function () {
                    rgiNotifierMock.expects('error').withArgs('An unknown error occurred');
                });

                afterEach(function () {
                    resetPasswordSpy = sinon.spy(function() {
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
                    resetPasswordSpy = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback(response);
                            }
                        };
                    });
                });
            });

            afterEach(function () {
                resetPasswordStub = sinon.stub(rgiResetPasswordSrvc, 'recover', resetPasswordSpy);
                executeAndValidateAndRestoreMock();
                $locationMock.verify();
                $locationMock.restore();
                resetPasswordSpy.withArgs(email).called.should.be.equal(true);
                resetPasswordStub.restore();
                $scope.recoverPasswordForm = recoverPasswordFormBackup;
                $scope.email = emailBackup;
            });
        });

    });
});
