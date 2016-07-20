'use strict';

describe('rgiDocumentAdminDetailCtrl', function () {
    beforeEach(module('app'));

    var $scope, $routeParams, rgiDialogFactory, rgiDocumentSrvc, rgiUserSrvc,
        documentGetStub, documentGetSpy,
        userGetCachedStub, userGetCachedSpy,
        document_ID = 'document id', $routeParamsDocument_ID,
        document = {users: ['user-id-1', 'user-id-2']};

    beforeEach(inject(
        function ($rootScope, $controller, _$routeParams_, _rgiDialogFactory_, _rgiDocumentSrvc_, _rgiUserSrvc_) {
            $routeParams = _$routeParams_;
            rgiDialogFactory = _rgiDialogFactory_;
            rgiDocumentSrvc = _rgiDocumentSrvc_;
            rgiUserSrvc = _rgiUserSrvc_;

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

            userGetCachedSpy = sinon.spy(function (criterion, callback) {
                callback(criterion._id.replace('-id', ''));
            });
            userGetCachedStub = sinon.stub(rgiUserSrvc, 'getCached', userGetCachedSpy);

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
            var dialogFactoryMock = sinon.mock(rgiDialogFactory);
            dialogFactoryMock.expects('documentEdit').withArgs($scope);

            $scope.editDocumentDialog();

            dialogFactoryMock.verify();
            dialogFactoryMock.restore();
        });
    });

    afterEach(function () {
        $routeParams.document_ID = $routeParamsDocument_ID;
        documentGetStub.restore();
        userGetCachedStub.restore();
    });
});
