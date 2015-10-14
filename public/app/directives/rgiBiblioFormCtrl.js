'use strict';

angular.module('app').controller('rgiBiblioFormCtrl', function ($scope, ngDialog, rgiNotifier) {

    $scope.ref_type = [
        {text: 'Add Document', value: 'document'},
        {text: 'Add Webpage', value: 'webpage'},
        {text: 'Add Interview', value: 'interview'}
    ];

    //TODO Generate Dialog based on change and handle upload process via dialogs
    $scope.select_ref_dialog = function(value) {
        var template = 'partials/dialogs/new-ref-' + value + '-dialog',
            className = 'ngdialog-theme-default dialogwidth800';
        $scope.ref_selection = value;

        ngDialog.open({
            template: template,
            controller: 'rgiNewRefDialogCtrl',
            className: className,
            scope: $scope
        });
    };
});