'use strict';

angular
    .module('app')
    .controller('rgiBiblioFormCtrl', function (
        $scope,
        rgiDialogFactory
    ) {
        $scope.ref_type = [
            {text: 'Add Document', value: 'document'},
            {text: 'Add Webpage', value: 'webpage'},
            {text: 'Add Interview', value: 'interview'}
        ];

        //TODO Generate Dialog based on change and handle upload process via dialogs
        $scope.select_ref_dialog = function(value) {
            rgiDialogFactory.referenceSelect($scope, value);
        };
    });