'use strict';

describe('rgiDeleteDocumentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiNotifier, rgiDocumentMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _rgiNotifier_, _rgiDocumentMethodSrvc_) {
            rgiNotifier = _rgiNotifier_;
            rgiDocumentMethodSrvc = _rgiDocumentMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiDeleteDocumentDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#deleteDocument', function() {
        var documentMethodDeleteDocumentStub, mocks = {}, spies = {}, DOCUMENT_ID = 'DOCUMENT ID',
            setDocumentMethodDeleteDocumentStub = function(callback) {
                spies.documentMethodDeleteDocument = sinon.spy(function() {
                    return {then: callback};
                });
                documentMethodDeleteDocumentStub = sinon.stub(rgiDocumentMethodSrvc, 'deleteDocument',
                    spies.documentMethodDeleteDocument);
            };

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
            $scope.document = {_id: DOCUMENT_ID};
            $scope.documents = [{_id: 'FIRST DOCUMENT ID'}, {_id: DOCUMENT_ID}, {_id: 'LAST DOCUMENT ID'}];
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setDocumentMethodDeleteDocumentStub(function(callback) {
                    callback();
                });

                mocks.notifier.expects('notify').withArgs('The document has been deleted');
                $scope.closeThisDialog = sinon.spy();
                $scope.deleteDocument();
            });

            it('closes the dialog', function() {
                $scope.closeThisDialog.called.should.be.equal(true);
            });

            it('removes the document from the list', function() {
                $scope.documents.should.deep.equal([{_id: 'FIRST DOCUMENT ID'}, {_id: 'LAST DOCUMENT ID'}]);
            });

            it('shows a confirmation message', function() {
                mocks.notifier.verify();
            });
        });

        it('shows an error message in case of a failure', function() {
            var FAILURE_REASON = 'FAILURE REASON';
            mocks.notifier.expects('error').withArgs(FAILURE_REASON);

            setDocumentMethodDeleteDocumentStub(function(callbackSuccess, callbackFailure) {
                callbackFailure(FAILURE_REASON);
            });

            $scope.deleteDocument();
            mocks.notifier.verify();
        });

        afterEach(function() {
            spies.documentMethodDeleteDocument.withArgs(DOCUMENT_ID).called.should.be.equal(true);
            documentMethodDeleteDocumentStub.restore();

            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});
