'use strict';

angular.module('app')
    .controller('rgiReferencesCtrl', function (
        $scope,
        rgiAnswerMethodSrvc,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiReferenceListSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.ref_type = [
            {text: 'Add Document', value: 'document'},
            //{text: 'Add Webpage', value: 'webpage'},
            {text: 'Add Interview', value: 'interview'}
        ];

        var resetSelection = function() {
            $scope.selected = {value: 'none'};
        };

        resetSelection();
        $scope.$on('RESET_SELECTED_REFERENCE_ACTION', resetSelection);

        $scope.deleteReferenceConfirmation = function(referenceIndex) {
            rgiDialogFactory.referenceDeleteConfirmation($scope, referenceIndex);
        };

        $scope.isReferenceListEmpty = function() {
            return rgiReferenceListSrvc.isEmpty($scope.references);
        };

        $scope.getOwnReferencesNumber = function() {
            return rgiReferenceListSrvc.getLength($scope.references, $scope.current_user);
        };

        //TODO Generate Dialog based on change and handle upload process via dialogs
        $scope.selectRefDialog = function(value) {
            rgiDialogFactory.referenceSelect($scope, value);
        };

        $scope.showEditDocumentReferenceDialog = function(referenceIndex) {
            rgiDialogFactory.editDocumentReference($scope, referenceIndex);
        };

        $scope.showEditInterviewReferenceDialog = function(referenceIndex) {
            rgiDialogFactory.editInterviewReference($scope, referenceIndex);
        };

        $scope.showRestoreReferenceDialog = function(referenceIndex) {
            rgiDialogFactory.restoreReference($scope, referenceIndex);
        };
    });
