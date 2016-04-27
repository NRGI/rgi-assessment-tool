'use strict';

describe('rgiProfileCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, rgiIdentitySrvc, rgiUserMethodSrvc, rgiNotifier;
    var currentUserBackUp;

    var dummyCurrentUser = {
        firstName: 'FIRST NAME',
        lastName: 'LAST NAME',
        email: 'EMAIL'
    };

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _rgiIdentitySrvc_, _rgiUserMethodSrvc_, _rgiNotifier_) {
            $scope = $rootScope.$new();
            $route = _$route_;
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
            var userMethodUpdateCurrentUserStub, userMethodUpdateCurrentUserSpy;

            beforeEach(function () {
                $scope.current_user.firstName = 'UPDATED FIRST NAME';
                $scope.current_user.lastName = 'UPDATED LAST NAME';
                $scope.current_user.email = 'UPDATED EMAIL';
            });

            describe('POSITIVE CASE', function() {
                var $routeMock;

                beforeEach(function () {
                    $routeMock = sinon.mock($route);
                    $routeMock.expects('reload');

                    userMethodUpdateCurrentUserSpy = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback();
                            }
                        };
                    });
                    userMethodUpdateCurrentUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', userMethodUpdateCurrentUserSpy);
                    notifierMock.expects('notify').withArgs('Your user account has been updated');
                });

                it('submits user data without password if the password is not set', function() {
                    $scope.password = '';
                    $scope.update();
                    userMethodUpdateCurrentUserSpy.withArgs({
                        firstName: $scope.current_user.firstName,
                        lastName: $scope.current_user.lastName,
                        email: $scope.current_user.email
                    }).called.should.be.equal(true);
                });

                it('submits user data without password & shows an error message if the passwords do not match', function() {
                    $scope.password = 'PASSWORD';
                    $scope.password_rep = ' ANOTHER PASSWORD';
                    notifierMock.expects('error').withArgs('Passwords must match!');
                    $scope.update();
                    userMethodUpdateCurrentUserSpy.withArgs({
                        firstName: $scope.current_user.firstName,
                        lastName: $scope.current_user.lastName,
                        email: $scope.current_user.email
                    }).called.should.be.equal(true);
                });

                it('submits user data (including password) if the passwords match', function() {
                    $scope.password = 'PASSWORD';
                    $scope.password_rep = 'PASSWORD';
                    $scope.update();

                    userMethodUpdateCurrentUserSpy.withArgs({
                        firstName: $scope.current_user.firstName,
                        lastName: $scope.current_user.lastName,
                        email: $scope.current_user.email,
                        password: $scope.password
                    }).called.should.be.equal(true);
                });

                afterEach(function () {
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
                    $scope.update();

                    userMethodUpdateCurrentUserSpy.withArgs({
                        firstName: $scope.current_user.firstName,
                        lastName: $scope.current_user.lastName,
                        email: $scope.current_user.email
                    }).called.should.be.equal(true);
                });

                it('submits user data (including password, if it is not empty) if the passwords match', function() {
                    $scope.password = 'PASSWORD';
                    $scope.password_rep = 'PASSWORD';
                    $scope.update();

                    userMethodUpdateCurrentUserSpy.withArgs({
                        firstName: $scope.current_user.firstName,
                        lastName: $scope.current_user.lastName,
                        email: $scope.current_user.email,
                        password: 'PASSWORD'
                    }).called.should.be.equal(true);
                });
            });

            afterEach(function () {
                userMethodUpdateCurrentUserStub.restore();
            });
        });

        afterEach(function () {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    afterEach(function () {
        rgiIdentitySrvc.currentUser = currentUserBackUp;
    });
});
