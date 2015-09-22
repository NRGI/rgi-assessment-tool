'use strict';
/*jshint -W079 */

var describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiProfileCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiIdentitySrvc, rgiUserMethodSrvc, rgiNotifier;
    var currentUserBackUp;

    var dummyCurrentUser = {
        firstName: 'FIRST NAME',
        lastName: 'LAST NAME',
        email: 'EMAIL',
        username: 'USERNAME',
        role: 'USER',
        address: 'ADDRESS'
    };

    beforeEach(inject(
        function ($rootScope, $controller, _rgiIdentitySrvc_, _rgiUserMethodSrvc_, _rgiNotifier_) {
            $scope = $rootScope.$new();
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;
            rgiNotifier = _rgiNotifier_;

            currentUserBackUp = rgiIdentitySrvc.currentUser;
            rgiIdentitySrvc.currentUser = dummyCurrentUser;

            $controller('rgiProfileCtrl', {$scope: $scope});
        }
    ));

    it('initialize the fields by values got from identity service', function () {
        $scope.fullName.should.be.equal(dummyCurrentUser.firstName + ' ' + dummyCurrentUser.lastName);
        $scope.first_name.should.be.equal(dummyCurrentUser.firstName);
        $scope.last_name.should.be.equal(dummyCurrentUser.lastName);
        $scope.email.should.be.equal(dummyCurrentUser.email);
        $scope.role.should.be.equal(dummyCurrentUser.role);
        $scope.username.should.be.equal(dummyCurrentUser.username);
        $scope.address.should.be.equal(dummyCurrentUser.address);
    });

    describe('#update', function() {
        var userMethodUpdateCurrentUserStub, userMethodUpdateCurrentUserSpy, notifierMock;

        beforeEach(function () {
            $scope.first_name = 'UPDATED FIRST NAME';
            $scope.last_name = 'UPDATED LAST NAME';
            $scope.email = 'UPDATED EMAIL';
            $scope.address = 'UPDATED ADDRESS';
            $scope.password = null;
            notifierMock = sinon.mock(rgiNotifier);
        });

        describe('POSITIVE CASE', function() {
            beforeEach(function () {
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

            it('submits updated user data & shows success notification', function() {
                $scope.update();
                userMethodUpdateCurrentUserSpy.withArgs({
                    firstName: $scope.first_name,
                    lastName: $scope.last_name,
                    email: $scope.email,
                    address: $scope.address
                }).called.should.be.equal(true);
            });

            it('submits updated user data (including password, if it is not empty) & shows success notification', function() {
                $scope.password = 'PASSWORD';
                $scope.password_rep = 'PASSWORD';
                $scope.update();
                userMethodUpdateCurrentUserSpy.withArgs({
                    firstName: $scope.first_name,
                    lastName: $scope.last_name,
                    email: $scope.email,
                    address: $scope.address,
                    password: $scope.password
                }).called.should.be.equal(true);
            });
        });

        //TODO add test for mismatched passwords
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
            });

            it('submits updated user data & shows failure notification', function() {
                $scope.update();
                userMethodUpdateCurrentUserSpy.withArgs({
                    firstName: $scope.first_name,
                    lastName: $scope.last_name,
                    email: $scope.email,
                    address: $scope.address
                }).called.should.be.equal(true);
            });

            it('submits updated user data (including password, if it is not empty) & shows failure notification', function() {
                $scope.password = 'PASSWORD';
                $scope.password_rep = 'PASSWORD';
                $scope.update();
                userMethodUpdateCurrentUserSpy.withArgs({
                    firstName: $scope.first_name,
                    lastName: $scope.last_name,
                    email: $scope.email,
                    address: $scope.address,
                    password: $scope.password
                }).called.should.be.equal(true);
            });
        });

        afterEach(function () {
            notifierMock.verify();
            notifierMock.restore();
            userMethodUpdateCurrentUserStub.restore();
        });
    });

    afterEach(function () {
        rgiIdentitySrvc.currentUser = currentUserBackUp;
    });
});
