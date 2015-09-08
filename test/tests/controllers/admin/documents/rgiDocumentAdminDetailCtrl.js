/*jslint node: true */
'use strict';
/*jslint nomen: true newcap: true */
var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiDocumentAdminDetailCtrl', function () {
    beforeEach(module('app'));

    var $scope, $routeParams, ngDialog, rgiDocumentSrvc, rgiUserListSrvc,
        documentGetStub, documentGetSpy,
        userListGetStub, userListGetSpy,
        document_ID = 'document id', $routeParamsDocument_ID,
        document = {users: ['user-id-1', 'user-id-2']};

    beforeEach(inject(
        function ($rootScope, $controller, _$routeParams_, _ngDialog_, _rgiDocumentSrvc_, _rgiUserListSrvc_) {
            $routeParams = _$routeParams_;
            ngDialog = _ngDialog_;
            rgiDocumentSrvc = _rgiDocumentSrvc_;
            rgiUserListSrvc = _rgiUserListSrvc_;

            $scope = $rootScope.$new();
            $routeParamsDocument_ID = $routeParams.document_ID;
            $routeParams.document_ID = document_ID;
            /*jshint unused: true*/
            /*jslint unparam: true*/
            documentGetSpy = sinon.spy(function (object, callback) {
                callback(document);
            });
            /*jshint unused: false*/
            /*jslint unparam: false*/
            documentGetStub = sinon.stub(rgiDocumentSrvc, 'get', documentGetSpy);

            userListGetSpy = sinon.spy(function (criterion, callback) {
                callback(criterion._id.replace('-id', ''));
            });
            userListGetStub = sinon.stub(rgiUserListSrvc, 'get', userListGetSpy);

            $controller('rgiDocumentAdminDetailCtrl', {$scope: $scope});
        }
    ));

    it('loads user list', function () {
        documentGetSpy.withArgs({_id: document_ID}).called.should.be.equal(true);
        _.isEqual(['user-1', 'user-2'], $scope.user_list).should.be.equal(true);
    });

    it('initializes the user list', function () {
        _.isEqual(document, $scope.document).should.be.equal(true);
    });

    describe('#editDocumentDialog', function () {
        it('calls dialog service with defined parameters', function () {
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('open').withArgs({
                template: 'partials/dialogs/edit-document-dialog',
                controller: 'rgiEditDocumentDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $scope.editDocumentDialog();

            ngDialogMock.verify();
            ngDialogMock.restore();
        });

        it('sets the value to TRUE', function () {
            $scope.editDocumentDialog();
            $scope.value.should.be.equal(true);
        });
    });

    afterEach(function () {
        $routeParams.document_ID = $routeParamsDocument_ID;
        documentGetStub.restore();
        userListGetStub.restore();
    });
});
