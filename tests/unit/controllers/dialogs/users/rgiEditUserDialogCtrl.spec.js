'use strict';

describe('rgiEditUserDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, $timeout, rgiUserMethodSrvc, rgiNotifier, AVAILABLE_ROLES_SET;

    var dummyCurrentUser = {
        firstName: 'FIRST NAME',
        lastName: 'LAST NAME',
        email: 'EMAIL'
    };

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$route_,
            _$timeout_,
            _rgiUserMethodSrvc_,
            _rgiNotifier_,
            _AVAILABLE_ROLES_SET_
        ) {
            $scope = $rootScope.$new();
            $route = _$route_;
            $timeout = _$timeout_;

            rgiUserMethodSrvc = _rgiUserMethodSrvc_;
            rgiNotifier = _rgiNotifier_;
            AVAILABLE_ROLES_SET = _AVAILABLE_ROLES_SET_;

            $scope.$parent.user = dummyCurrentUser;
            $controller('rgiEditUserDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets the user data', function () {
        $scope.new_user_data.should.deep.equal(dummyCurrentUser);
    });

    it('gets role list', function () {
        $scope.roles.should.deep.equal(AVAILABLE_ROLES_SET);
    });

    describe('#update', function() {
        var notifierMock;

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASE', function() {
            it('shows an error message if the email is not set', function() {
                $scope.user.email = '';
                notifierMock.expects('error').withArgs('You must enter an email address!');
            });

            it('shows an error message if the first name is not set', function() {
                $scope.user.email = 'name@mail.com';
                $scope.user.firstName = '';
                notifierMock.expects('error').withArgs('You must enter an first and last name!');
            });

            it('shows an error message if the last name is not set', function() {
                $scope.user.email = 'name@mail.com';
                $scope.user.firstName = 'FIRST NAME';
                $scope.user.lastName = '';
                notifierMock.expects('error').withArgs('You must enter an first and last name!');
            });

            it('shows an error message if the last name is not set', function() {
                $scope.user.email = 'name@mail.com';
                $scope.user.firstName = 'FIRST NAME';
                $scope.user.lastName = 'LAST NAME';
                $scope.user.role = undefined;
                notifierMock.expects('error').withArgs('You must enter a role!');
            });

            afterEach(function () {
                $scope.update();
            });
        });

        describe('COMPLETE DATA CASE', function() {
            var userMethodUpdateCurrentUserStub, userMethodUpdateCurrentUserSpy, finallySpy, expectedUpdateData,
                getExpectedSubmittedData = function(includePassword) {
                    var submittedData = {
                        firstName: $scope.user.firstName,
                        lastName: $scope.user.lastName,
                        email: $scope.user.email,
                        role: $scope.user.role
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
                $scope.user.firstName = 'FIRST NAME';
                $scope.user.lastName = 'LAST NAME';
                $scope.user.email = 'EMAIL';
                $scope.user.role = 'ROLE';

                finallySpy = sinon.spy();
                $scope.closeThisDialog = 'closeThisDialog';
            });

            describe('POSITIVE CASE', function() {
                var $routeMock;

                beforeEach(function () {
                    $routeMock = sinon.mock($route);

                    userMethodUpdateCurrentUserSpy = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback();
                                return {finally: finallySpy};
                            }
                        };
                    });
                    userMethodUpdateCurrentUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', userMethodUpdateCurrentUserSpy);
                });

                it('submits user data without password if the password is not set', function() {
                    notifierMock.expects('notify').withArgs('User account has been updated');
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
                    notifierMock.expects('notify').withArgs('User account has been updated');
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
                                return {finally: finallySpy};
                            }
                        };
                    });
                    userMethodUpdateCurrentUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', userMethodUpdateCurrentUserSpy);
                    notifierMock.expects('error').withArgs(FAILURE_REASON);
                    delete $scope.user.password;
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
                    finallySpy.called.should.be.equal(false);
                } else {
                    userMethodUpdateCurrentUserSpy.withArgs(expectedUpdateData).called.should.be.equal(true);
                    finallySpy.called.should.be.equal(true);
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
            notifierMock.expects('error').withArgs('The password should consist of 6-8 characters including at least ' +
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
});
