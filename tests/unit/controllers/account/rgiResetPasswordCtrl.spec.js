'use strict';

describe('rgiResetPasswordCtrl', function () {
    beforeEach(module('app'));

    var $scope, $routeParams, rgiHttpResponseProcessorSrvc, rgiNotifier, rgiResetPasswordSrvc;

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$routeParams_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiNotifier_,
            _rgiResetPasswordSrvc_
        ) {
            $routeParams = _$routeParams_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiResetPasswordSrvc = _rgiResetPasswordSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiResetPasswordCtrl', {$scope: $scope});
        }
    ));

    describe('#resetPassword', function () {
        var rgiNotifierMock,
            executeAndValidateAndRestoreMock = function() {
                $scope.resetPassword();
                rgiNotifierMock.verify();
                rgiNotifierMock.restore();
            };

        beforeEach(function () {
            rgiNotifierMock = sinon.mock(rgiNotifier);
        });

        describe('INVALID CASE', function() {
            it('shows an error message, if the password is too short', function () {
                $scope.password = '';
                rgiNotifierMock.expects('error').withArgs('The password cannot be empty');
            });

            it('shows an error message, if the passwords do not match', function () {
                $scope.password = 'original password';
                $scope.passwordRepeat = 'mismatched password';
                rgiNotifierMock.expects('error').withArgs('The passwords must match');
            });

            afterEach(executeAndValidateAndRestoreMock);
        });

        describe('VALID CASE', function() {
            var spies = {}, stubs = {}, response, passwordBackup, passwordRepeatBackup, tokenBackup, extraCheck,
                password = 'PASSWORD', token = 'TOKEN';

            beforeEach(function () {
                tokenBackup = $routeParams.token;
                passwordBackup = $scope.password;
                passwordRepeatBackup = $scope.passwordRepeat;

                $routeParams.token = token;
                $scope.password = password;
                $scope.passwordRepeat = password;

                rgiNotifierMock = sinon.mock(rgiNotifier);
                extraCheck = function() {};
            });

            describe('NEGATIVE CASE', function() {
                beforeEach(function() {
                    spies.httpResponseProcessorHandle = sinon.spy();
                    stubs.httpResponseProcessorHandle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle',
                        spies.httpResponseProcessorHandle);

                    extraCheck = function() {
                        spies.httpResponseProcessorHandle.withArgs(response).called.should.be.equal(true);
                    };

                    stubs.httpResponseProcessorGetMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage', function() {
                        return 'An unknown error occurred';
                    });
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
                        code: 'TOKEN_NOT_FOUND',
                        message: 'The token is not found',
                        case: 'token is not found'
                    },
                    {
                        code: 'USER_NOT_FOUND',
                        message: 'The user is not found',
                        case: 'user is not found'
                    },
                    {
                        code: 'SET_PASSWORD_ERROR',
                        message: 'Unable to set password',
                        case: 'password reset is failed'
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
                    rgiNotifierMock.expects('notify')
                        .withArgs('The password has been successfully reset. You can log in using your new password.');
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
                stubs.resetPassword = sinon.stub(rgiResetPasswordSrvc, 'reset', spies.resetPassword);
                executeAndValidateAndRestoreMock();
                spies.resetPassword.withArgs(token, password).called.should.be.equal(true);

                Object.keys(stubs).forEach(function(stubName) {
                    stubs[stubName].restore();
                });

                extraCheck();
                $routeParams.token = tokenBackup;
                $scope.password = passwordBackup;
                $scope.passwordRepeat = passwordRepeatBackup;
            });
        });
    });
});
