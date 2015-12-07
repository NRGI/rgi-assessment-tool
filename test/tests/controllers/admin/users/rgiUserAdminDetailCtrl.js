'use strict';
/*jshint -W079 */

var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiUserAdminDetailCtrl', function () {
    beforeEach(module('app'));
    var $scope, $routeParams, rgiUserSrvc, rgiDialogFactory,
        userGetStub, userGetSpy, userIdBackup, userId = 'USER_ID', userData = {_id: 'USER'};

    beforeEach(inject(
        function ($rootScope, $controller, _$routeParams_, _rgiUserSrvc_, _rgiDialogFactory_) {
            $scope = $rootScope.$new();
            $routeParams = _$routeParams_;
            rgiUserSrvc = _rgiUserSrvc_;
            rgiDialogFactory = _rgiDialogFactory_;

            userIdBackup = $routeParams.id;
            $routeParams.id = userId;

            userGetSpy = sinon.spy(function (uselessCriterion, callback) {
                callback(userData);
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

    it('requires user data', function () {
        userGetSpy.withArgs({_id: userId}).called.should.be.equal(true);
    });

    it('loads user data', function () {
        $scope.user.should.be.equal(userData);
    });

    it('clears user document details', function () {
        $scope.user.document_details.should.deep.equal([]);
    });

    describe('DIALOGS', function () {
        var dialogFactoryMock;

        beforeEach(function () {
            dialogFactoryMock = sinon.mock(rgiDialogFactory);
        });

        describe('#deleteConfirmDialog', function () {
            it('opens delete dialog', function () {
                dialogFactoryMock.expects('userDelete').withArgs($scope);
                $scope.deleteConfirmDialog();
            });
        });

        describe('#editUserDialog', function () {
            it('opens edit dialog', function () {
                dialogFactoryMock.expects('userEdit').withArgs($scope);
                $scope.editUserDialog();
            });
        });

        afterEach(function () {
            dialogFactoryMock.verify();
            dialogFactoryMock.restore();
        });
    });

    afterEach(function () {
        $routeParams.id = userIdBackup;
        userGetStub.restore();
    });
});
