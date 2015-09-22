'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, afterEach, it, inject, expect, module, sinon;

describe('rgiUserCreateCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiNotifier, rgiUserMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiNotifier_, _rgiUserMethodSrvc_) {
            $location = _$location_;
            rgiNotifier = _rgiNotifier_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiUserCreateCtrl', {$scope: $scope});
        }
    ));

    it('initializes role options', function () {
        _.isEqual($scope.role_options, [
            {value: 'supervisor', text: 'Supervisor'},
            {value: 'researcher', text: 'Researcher'},
            {value: 'reviewer', text: 'Reviewer'}
        ]).should.be.equal(true);
    });

    describe('#userCreate', function () {
        var rgiNotifierMock;

        beforeEach(function () {
            rgiNotifierMock = sinon.mock(rgiNotifier);
        });

        describe('PASSWORDS DO NOT MATCH', function () {
            it('shows error', function () {
                $scope.password = 'PASSWORD';
                $scope.password_repeat = 'DIFFERENT PASSWORD';
                rgiNotifierMock.expects('error').withArgs('Passwords must match!');
                $scope.userCreate();
            });
        });

        describe('PASSWORDS MATCH', function () {
            var userData, $locationMock, userMethodCreateUserStub, userMethodCreateUserSpy;

            beforeEach(function () {
                userData = {
                    firstName: 'FIRST NAME',
                    lastName: 'LAST NAME',
                    username: 'USERNAME',
                    email: 'EMAIL@DOMAIN.COM',
                    password: 'PASSWORD',
                    role: 'ROLE',
                    address: ['ADDRESS']
                };

                $scope.first_name = userData.firstName;
                $scope.last_name = userData.lastName;
                $scope.username = userData.username;
                $scope.email = userData.email;
                $scope.password = userData.password;
                $scope.roleSelect = userData.role;
                $scope.address = userData.address[0];
            });

            it('shows notification and redirects on success', function() {
                rgiNotifierMock.expects('notify').withArgs('User account created!' + userData.email);
                $locationMock = sinon.mock($location);
                $locationMock.expects('path').withArgs('/admin/user-admin');

                userMethodCreateUserSpy = sinon.spy(function () {
                    return {
                        then: function (callback) {
                            callback();
                        }
                    };
                });
                userMethodCreateUserStub = sinon.stub(rgiUserMethodSrvc, 'createUser', userMethodCreateUserSpy);

                $scope.password_repeat = userData.password;
                $scope.userCreate();

                $locationMock.verify();
                $locationMock.restore();
            });

            it('shows an error on failure', function() {
                var reason = 'REASON';
                rgiNotifierMock.expects('error').withArgs(reason);

                userMethodCreateUserSpy = sinon.spy(function () {
                    return {
                        then: function (uselessSuccessCallback, failureCallback) {
                            failureCallback(reason);
                        }
                    };
                });
                userMethodCreateUserStub = sinon.stub(rgiUserMethodSrvc, 'createUser', userMethodCreateUserSpy);

                $scope.password_repeat = userData.password;
                $scope.userCreate();
            });

            afterEach(function () {
                userMethodCreateUserSpy.withArgs(userData).called.should.be.equal(true);
                userMethodCreateUserStub.restore();
            });
        });

        afterEach(function () {
            rgiNotifierMock.verify();
            rgiNotifierMock.restore();
        });
    });
});
