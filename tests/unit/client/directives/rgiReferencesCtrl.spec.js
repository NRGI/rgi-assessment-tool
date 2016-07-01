'use strict';

describe('rgiReferencesCtrl', function () {
    beforeEach(module('app'));
    var $scope, rgiDialogFactory, rgiIdentitySrvc, rgiReferenceListSrvc, scopeOnCallback;

    beforeEach(inject(
        function ($rootScope, $controller, _rgiDialogFactory_, _rgiIdentitySrvc_, _rgiReferenceListSrvc_) {
            rgiDialogFactory = _rgiDialogFactory_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiReferenceListSrvc = _rgiReferenceListSrvc_;

            $scope = $rootScope.$new();
            $scope.$on = sinon.spy(function(commandName, callback) {
                scopeOnCallback = callback;
            });

            $controller('rgiReferencesCtrl', {$scope: $scope});
        }
    ));

    it('sets reference types', function() {
        $scope.ref_type.should.deep.equal([
            {text: 'Add Document', value: 'document'},
            {text: 'Add Interview', value: 'interview'}
        ]);
    });

    it('resets selected reference type', function() {
        $scope.selected.value.should.be.equal('none');
    });

    it('initializes broadcast event listener', function() {
        $scope.$on.withArgs('RESET_SELECTED_REFERENCE_ACTION').called.should.be.equal(true);
    });

    describe('$on', function() {
        it('resets selected reference type', function() {
            $scope.selected.value = 'some value';
            scopeOnCallback();
            $scope.selected.value.should.be.equal('none');
        });
    });

    describe('DIALOGS', function() {
        var dialogFactoryMock, referenceIndex = 1;

        beforeEach(function() {
            dialogFactoryMock = sinon.mock(rgiDialogFactory);
        });

        describe('#deleteReferenceConfirmation', function() {
            it('opens a dialog', function() {
                dialogFactoryMock.expects('referenceDeleteConfirmation').withArgs($scope, referenceIndex);
                $scope.deleteReferenceConfirmation(referenceIndex);
            });
        });

        describe('#selectRefDialog', function() {
            it('opens a dialog', function() {
                dialogFactoryMock.expects('referenceSelect').withArgs($scope, referenceIndex);
                $scope.selectRefDialog(referenceIndex);
            });
        });

        describe('#showEditDocumentReferenceDialog', function() {
            it('opens a dialog', function() {
                dialogFactoryMock.expects('editDocumentReference').withArgs($scope, referenceIndex);
                $scope.showEditDocumentReferenceDialog(referenceIndex);
            });
        });

        describe('#showEditInterviewReferenceDialog', function() {
            it('opens a dialog', function() {
                dialogFactoryMock.expects('editInterviewReference').withArgs($scope, referenceIndex);
                $scope.showEditInterviewReferenceDialog(referenceIndex);
            });
        });

        describe('#showRestoreReferenceDialog', function() {
            it('opens a dialog', function() {
                dialogFactoryMock.expects('restoreReference').withArgs($scope, referenceIndex);
                $scope.showRestoreReferenceDialog(referenceIndex);
            });
        });

        afterEach(function() {
            dialogFactoryMock.verify();
            dialogFactoryMock.restore();
        });
    });

    describe('REFERENCES', function() {
        var spy, stub, actualResult, DUMMY_RESULT = 'dummy result';

        beforeEach(function() {
            spy = sinon.spy(function() {
                return DUMMY_RESULT;
            });
        });

        describe('#isReferenceListEmpty', function() {
            it('submits a request to the corresponding service', function() {
                stub = sinon.stub(rgiReferenceListSrvc, 'isEmpty', spy);
                actualResult = $scope.isReferenceListEmpty();
                spy.withArgs($scope.references).called.should.be.equal(true);
            });
        });

        describe('#getOwnReferencesNumber', function() {
            it('submits a request to the corresponding service', function() {
                stub = sinon.stub(rgiReferenceListSrvc, 'getLength', spy);
                actualResult = $scope.getOwnReferencesNumber();
                spy.withArgs($scope.references, rgiIdentitySrvc.currentUser).called.should.be.equal(true);
            });
        });

        afterEach(function() {
            actualResult.should.be.equal(DUMMY_RESULT);
            stub.restore();
        });
    });
});
