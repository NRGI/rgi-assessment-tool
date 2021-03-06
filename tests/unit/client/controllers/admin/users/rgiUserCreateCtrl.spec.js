'use strict';
/*jshint -W079 */

describe('rgiUserCreateCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiNotifier, rgiUserMethodSrvc, AVAILABLE_ROLES_SET;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiNotifier_, _rgiUserMethodSrvc_, _AVAILABLE_ROLES_SET_) {
            $location = _$location_;
            rgiNotifier = _rgiNotifier_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;
            AVAILABLE_ROLES_SET = _AVAILABLE_ROLES_SET_;

            $scope = $rootScope.$new();
            $controller('rgiUserCreateCtrl', {$scope: $scope});
        }
    ));

    it('gets role list', function () {
        $scope.roles.should.deep.equal(AVAILABLE_ROLES_SET);
    });

    describe('#userCreate', function () {
        var rgiNotifierMock;
        var userData, $locationMock, userMethodCreateUserStub, userMethodCreateUserSpy;

        beforeEach(function () {
            rgiNotifierMock = sinon.mock(rgiNotifier);

            userData = {
                firstName: 'FIRST NAME',
                lastName: 'LAST NAME',
                username: 'USERNAME',
                email: 'EMAIL@DOMAIN.COM',
                role: 'ROLE',
                address: ['ADDRESS']
            };

            $scope.new_user_data = userData;
            $scope.email = userData.email;
        });

        it('shows notification and redirects on success', function() {
            rgiNotifierMock.expects('notify').withArgs('User account created! ' + userData.email);
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

            $scope.userCreate();

            $locationMock.verify();
            $locationMock.restore();
        });

        it('shows an error on failure', function() {
            var reason = 'REASON';
            rgiNotifierMock.expects('error').withArgs(reason+'!');

            userMethodCreateUserSpy = sinon.spy(function () {
                return {
                    then: function (uselessSuccessCallback, failureCallback) {
                        failureCallback(reason);
                    }
                };
            });

            userMethodCreateUserStub = sinon.stub(rgiUserMethodSrvc, 'createUser', userMethodCreateUserSpy);
            $scope.userCreate();
        });

        afterEach(function () {
            userMethodCreateUserSpy.withArgs(userData).called.should.be.equal(true);
            userMethodCreateUserStub.restore();
            rgiNotifierMock.verify();
            rgiNotifierMock.restore();
        });
    });
});
