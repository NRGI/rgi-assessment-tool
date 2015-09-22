/*jslint node: true */
'use strict';
/*jslint nomen: true newcap: true */
var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiUserAdminDetailCtrl', function () {
    beforeEach(module('app'));
    var $scope, $routeParams, ngDialog, rgiNotifier, rgiUserSrvc, rgiUserMethodSrvc,
        userGetStub, userGetSpy, userIdBackup, userId = 'USER_ID', userData = {_id: 'USER'};

    beforeEach(inject(
        function ($rootScope, $controller, _$routeParams_, _ngDialog_, _rgiNotifier_, _rgiUserSrvc_, _rgiUserMethodSrvc_) {
            $scope = $rootScope.$new();
            $routeParams = _$routeParams_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiUserSrvc = _rgiUserSrvc_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;

            userIdBackup = $routeParams.id;
            $routeParams.id = userId;

            userGetSpy = sinon.spy(function () {
                return userData;
            });
            userGetStub = sinon.stub(rgiUserSrvc, 'get', userGetSpy);

            $controller('rgiUserAdminDetailCtrl', {$scope: $scope});
        }
    ));

    it('initializes role options', function () {
        _.isEqual($scope.role_options, [
            {value: 'supervisor', text: 'Supervisor'},
            {value: 'researcher', text: 'Researcher'},
            {value: 'reviewer', text: 'Reviewer'}
        ]).should.be.equal(true);
    });

    it('loads user data', function () {
        $scope.user.should.be.equal(userData);
        userGetSpy.withArgs({_id: userId}).called.should.be.equal(true);
    });

    describe('#deleteConfirmDialog', function () {
        it('sets the value to TRUE', function () {
            $scope.deleteConfirmDialog();
            $scope.value.should.be.equal(true);
        });

        it('shows a dialog', function () {
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('open').withArgs({
                template: 'partials/dialogs/delete-profile-confirmation-dialog',
                controller: 'rgiDeleteProfileDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $scope.deleteConfirmDialog();

            ngDialogMock.verify();
            ngDialogMock.restore();
        });

    });

    describe('#userUpdate', function () {
        var notifierMock, userMethodUpdateUserStub, userMethodUpdateUserSpy,
            REASON = 'REASON',
            setNegativeStub = function () {
                /*jshint unused: true*/
                /*jslint unparam: true*/
                userMethodUpdateUserSpy = sinon.spy(function () {
                    return {
                        then: function (callbackPositive, callbackNegative) {
                            callbackNegative(REASON);
                        }
                    };
                });
                /*jshint unused: false*/
                /*jslint unparam: false*/
                userMethodUpdateUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', userMethodUpdateUserSpy);
            },
            setPositiveStub = function () {
                userMethodUpdateUserSpy = sinon.spy(function () {
                    return {
                        then: function (callback) {
                            callback();
                        }
                    };
                });
                userMethodUpdateUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', userMethodUpdateUserSpy);
            };

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
        });

        it('shows an error message if email is not set', function () {
            $scope.user.email = '';
            notifierMock.expects('error').withArgs('You must enter an email address!');
            $scope.userUpdate();
        });

        it('shows an error message if the first name is not set', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = '';
            notifierMock.expects('error').withArgs('You must enter an full name!');
            $scope.userUpdate();
        });

        it('shows an error message if the last name is not set', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = 'First Name';
            $scope.user.lastName = '';
            notifierMock.expects('error').withArgs('You must enter an full name!');
            $scope.userUpdate();
        });

        it('shows an error message if role is not set', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = 'First Name';
            $scope.user.lastName = 'Last Name';
            $scope.user.role = '';
            notifierMock.expects('error').withArgs('You must enter a role!');
            $scope.userUpdate();
        });

        it('shows an error message if the passwords do not match', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = 'First Name';
            $scope.user.lastName = 'Last Name';
            $scope.user.role = 'user';
            $scope.password = 'password';
            $scope.password_rep = 'different password';
            notifierMock.expects('error').withArgs('Passwords must match!');
            $scope.userUpdate();
        });

        it('shows a success message if the password is not set', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = 'First Name';
            $scope.user.lastName = 'Last Name';
            $scope.user.role = 'user';

            setPositiveStub();
            notifierMock.expects('notify').withArgs('User account has been updated');

            $scope.userUpdate();

            userMethodUpdateUserStub.restore();
            userMethodUpdateUserSpy.withArgs({
                _id: 'USER',
                email: 'name@domain.com',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: 'user'
            }).called.should.be.equal(true);
        });

        it('shows an error message on failure if the password is not set', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = 'First Name';
            $scope.user.lastName = 'Last Name';
            $scope.user.role = 'user';

            setNegativeStub();
            notifierMock.expects('error').withArgs(REASON);

            $scope.userUpdate();

            userMethodUpdateUserStub.restore();
            userMethodUpdateUserSpy.withArgs({
                _id: 'USER',
                email: 'name@domain.com',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: 'user'
            }).called.should.be.equal(true);
        });

        it('shows a success message if the passwords match', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = 'First Name';
            $scope.user.lastName = 'Last Name';
            $scope.user.role = 'user';
            $scope.password = 'password';
            $scope.password_rep = 'password';

            setPositiveStub();
            notifierMock.expects('notify').withArgs('User account has been updated');

            $scope.userUpdate();

            userMethodUpdateUserStub.restore();
            userMethodUpdateUserSpy.withArgs({
                _id: 'USER',
                email: 'name@domain.com',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: 'user',
                password: 'password'
            }).called.should.be.equal(true);
        });

        it('shows an error message on failure if the passwords match', function () {
            $scope.user.email = 'name@domain.com';
            $scope.user.firstName = 'First Name';
            $scope.user.lastName = 'Last Name';
            $scope.user.role = 'user';
            $scope.password = 'password';
            $scope.password_rep = 'password';

            setNegativeStub();
            notifierMock.expects('error').withArgs(REASON);

            $scope.userUpdate();

            userMethodUpdateUserStub.restore();
            userMethodUpdateUserSpy.withArgs({
                _id: 'USER',
                email: 'name@domain.com',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: 'user',
                password: 'password'
            }).called.should.be.equal(true);
        });

        afterEach(function () {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    afterEach(function () {
        $routeParams.id = userIdBackup;
        userGetStub.restore();
    });
});
