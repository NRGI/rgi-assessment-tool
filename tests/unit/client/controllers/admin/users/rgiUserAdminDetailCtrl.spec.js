'use strict';

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
        var dialogFactoryMock, checkDialog = function(scopeMethod, expectedDialogFactoryMethod) {
            describe('#' + scopeMethod, function () {
                it('opens a dialog', function () {
                    dialogFactoryMock.expects(expectedDialogFactoryMethod).withArgs($scope);
                    $scope[scopeMethod]();
                });
            });
        };

        beforeEach(function () {
            dialogFactoryMock = sinon.mock(rgiDialogFactory);
        });

        checkDialog('deleteConfirmDialog', 'userDelete');
        checkDialog('editUserDialog', 'userEdit');
        checkDialog('addToAssessment', 'assessmentAddReviewer');
        checkDialog('toggleUserDisabledStatus', 'toggleUserDisabledStatus');

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
