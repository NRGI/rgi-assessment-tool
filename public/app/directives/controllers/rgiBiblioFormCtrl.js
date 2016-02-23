'use strict';

angular.module('app')
    .controller('rgiBiblioFormCtrl', function (
        $scope,
        rgiAnswerMethodSrvc,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiNotifier
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.ref_type = [
            {text: 'Add Document', value: 'document'},
            {text: 'Add Webpage', value: 'webpage'},
            {text: 'Add Interview', value: 'interview'}
        ];

        var resetSelection = function() {
            $scope.selected = {value: 'none'};
        };

        resetSelection();
        $scope.$on('RESET_SELECTED_REFERENCE_ACTION', resetSelection);

        $scope.deleteReference = function(referenceId) {
            var removeReferenceIndex = -1;

            for(var i in $scope.answer.references) {
                if($scope.answer.references.hasOwnProperty(i) && $scope.answer.references[i]._id === referenceId) {
                    removeReferenceIndex = i;
                }
            }

            if(removeReferenceIndex > -1) {
                var referencesBackup = $scope.answer.references.slice(0);
                $scope.answer.references.splice(removeReferenceIndex, 1);

                rgiAnswerMethodSrvc.updateAnswer($scope.answer).then(function () {
                    rgiNotifier.notify('The reference has been deleted');
                }, function (reason) {
                    rgiNotifier.error(reason);
                    $scope.answer.references = referencesBackup;
                });
            }
        };

        //TODO Generate Dialog based on change and handle upload process via dialogs
        $scope.selectRefDialog = function(value) {
            rgiDialogFactory.referenceSelect($scope, value);
        };
    });