'use strict';

describe('rgiProfileCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, $timeout, rgiIdentitySrvc, rgiUserMethodSrvc, rgiNotifier;
    var currentUserBackUp;

    var dummyCurrentUser = {
        lastName: 'LAST NAME',
        email: 'EMAIL'
    };

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _$timeout_, _rgiIdentitySrvc_, _rgiUserMethodSrvc_, _rgiNotifier_) {
            $scope = $rootScope.$new();
            $route = _$route_;
            $timeout = _$timeout_;

            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;
            rgiNotifier = _rgiNotifier_;

            currentUserBackUp = rgiIdentitySrvc.currentUser;
            rgiIdentitySrvc.currentUser = dummyCurrentUser;
            $controller('rgiProfileCtrl', {$scope: $scope});
        }
    ));

    it('sets the current user data', function () {
        $scope.current_user.should.deep.equal(dummyCurrentUser);
    });

    describe('#update', function() {
        var notifierMock;

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASE', function() {
            it('shows an error message if the first name is not set', function() {
                $scope.current_user.firstName = '';
                notifierMock.expects('error').withArgs('You must supply a first and last name!');
            });

            it('shows an error message if the last name is not set', function() {
                $scope.current_user.firstName = 'UPDATED FIRST NAME';
                $scope.current_user.lastName = '';
                notifierMock.expects('error').withArgs('You must supply a first and last name!');
            });

            it('shows an error message if the email is not set', function() {
                $scope.current_user.firstName = 'UPDATED FIRST NAME';
                $scope.current_user.lastName = 'UPDATED LAST NAME';
                $scope.current_user.email = '';
                notifierMock.expects('error').withArgs('You must supply an email!');
            });

            afterEach(function () {
                $scope.update();
            });
        });

        describe('COMPLETE DATA CASE', function() {
            var userMethodUpdateCurrentUserStub, userMethodUpdateCurrentUserSpy, expectedUpdateData,
                getExpectedSubmittedData = function(includePassword) {
                    var submittedData = {
                        firstName: $scope.current_user.firstName,
                        lastName: $scope.current_user.lastName,
                        email: $scope.current_user.email
                    };

                    if(includePassword) {
                        submittedData.password = $scope.password;
                    }

                    return submittedData;
                },
                setValidationCriteria = function(updateData) {
                    expectedUpdateData = updateData;
                };

            beforeEach(function () {
                $scope.current_user.firstName = 'UPDATED FIRST NAME';
                $scope.current_user.lastName = 'UPDATED LAST NAME';
                $scope.current_user.email = 'UPDATED EMAIL';
            });

            describe('POSITIVE CASE', function() {
                var $routeMock;

                beforeEach(function () {
                    $routeMock = sinon.mock($route);

                    userMethodUpdateCurrentUserSpy = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback();
                            }
                        };
                    });
                    userMethodUpdateCurrentUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', userMethodUpdateCurrentUserSpy);
                });

                it('submits user data without password if the password is not set', function() {
                    notifierMock.expects('notify').withArgs('Your user account has been updated');
                    $scope.password = '';
                    setValidationCriteria(getExpectedSubmittedData(false));
                });

                it('submits user data without password & shows an error message if the passwords do not match', function() {
                    notifierMock.expects('error').withArgs('Passwords must match!');
                    $scope.password = 'PASSWORD';
                    $scope.password_rep = ' ANOTHER PASSWORD';
                    setValidationCriteria(false);
                });

                it('submits user data (including password) if the passwords match', function() {
                    notifierMock.expects('notify').withArgs('Your user account has been updated');
                    $scope.password = 'PASSWORD';
                    $scope.password_rep = 'PASSWORD';
                    setValidationCriteria(getExpectedSubmittedData(true));
                });

                afterEach(function () {
                    if(expectedUpdateData !== false) {
                        $routeMock.expects('reload');
                    }

                    $scope.update();

                    $routeMock.verify();
                    $routeMock.restore();
                });
            });

            describe('NEGATIVE CASE', function() {
                var FAILURE_REASON = 'FAILURE REASON';

                beforeEach(function () {
                    userMethodUpdateCurrentUserSpy = sinon.spy(function() {
                        return {
                            then: function(callbackPositive, callbackNegative) {
                                callbackNegative(FAILURE_REASON);
                            }
                        };
                    });
                    userMethodUpdateCurrentUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', userMethodUpdateCurrentUserSpy);
                    notifierMock.expects('error').withArgs(FAILURE_REASON);
                    delete $scope.current_user.password;
                });

                it('submits updated user data', function() {
                    $scope.password = '';
                    setValidationCriteria(getExpectedSubmittedData(false));
                });

                it('submits user data (including password, if it is not empty) if the passwords match', function() {
                    $scope.password = 'PASSWORD';
                    $scope.password_rep = 'PASSWORD';
                    setValidationCriteria(getExpectedSubmittedData(true));
                });

                afterEach(function () {
                    $scope.update();
                });
            });

            afterEach(function () {
                if(expectedUpdateData === false) {
                    userMethodUpdateCurrentUserSpy.called.should.be.equal(false);
                } else {
                    userMethodUpdateCurrentUserSpy.withArgs(expectedUpdateData).called.should.be.equal(true);
                }

                userMethodUpdateCurrentUserStub.restore();
            });
        });

        afterEach(function () {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    describe('#checkPassword', function() {
        var notifierMock,
            setPasswordInvalidity = function(invalidity) {
                $scope.profileForm = {password: {$invalid: invalidity}};
            };

        beforeEach(function() {
            notifierMock = sinon.mock(rgiNotifier);
        });

        it('does nothing until timeout period is elapsed', function() {
            setPasswordInvalidity(true);
            $scope.checkPassword();
            notifierMock.expects('error').never();
        });

        it('shows an error message once the timeout period is elapsed and if the password is invalid', function() {
            setPasswordInvalidity(true);
            $scope.checkPassword();
            notifierMock.expects('error').withArgs('The password should consist of 8-16 characters including at least ' +
            'one digit, at least one lower-case letter, at least one upper-case letter and at least one special character');
            $timeout.flush();
        });

        it('does nothing if the password is invalid', function() {
            setPasswordInvalidity(false);
            $scope.checkPassword();
            notifierMock.expects('error').never();
            $timeout.verifyNoPendingTasks();
        });

        it('does nothing if the password become valid until the timeout period is elapsed', function() {
            setPasswordInvalidity(true);
            $scope.checkPassword();
            setPasswordInvalidity(false);
            $scope.checkPassword();
            notifierMock.expects('error').never();
            $timeout.verifyNoPendingTasks();
        });

        afterEach(function() {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    describe('#checkPasswordsMatch', function() {
        var setValiditySpy, setData = function(passwordValid, repeatPasswordTouched, password, repeatPassword) {
            setValiditySpy = sinon.spy();

            $scope.profileForm = {
                password: {$valid: passwordValid},
                password_rep: {
                    $touched: repeatPasswordTouched,
                    $setValidity: setValiditySpy
                }
            };

            $scope.password = password;
            $scope.password_rep = repeatPassword;
        };

        it('does nothing if the password is invalid', function() {
            setData(false);
            $scope.checkPasswordsMatch(true);
            setValiditySpy.called.should.be.equal(false);
        });

        it('does nothing if the repeat password field is invalid and the check is not called by force', function() {
            setData(true, false);
            $scope.checkPasswordsMatch(false);
            setValiditySpy.called.should.be.equal(false);
        });

        it('sets validity if the repeat password field is invalid but the check is called by force', function() {
            setData(true, false, 'password', 'password');
            $scope.checkPasswordsMatch(true);
            setValiditySpy.withArgs('matched', true).called.should.be.equal(true);
        });

        it('sets validity to `FALSE` if the passwords do not match', function() {
            setData(true, true, 'password', 'another password');
            $scope.checkPasswordsMatch(false);
            setValiditySpy.withArgs('matched', false).called.should.be.equal(true);
        });
    });

    afterEach(function () {
        rgiIdentitySrvc.currentUser = currentUserBackUp;
    });
});
