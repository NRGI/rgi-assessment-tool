'use strict';

angular.module('app').controller('rgiBiblioFormCtrl', function ($scope, ngDialog) {
    //DATEPICKER OPTS
    $scope.date_format = 'MMMM d, yyyy';
    var today = new Date();
    $scope.date_default = today;
    $scope.date_max_limit = today;

    //TODO Generate Dialog based on change and handle upload process via dialogs
    $scope.select_ref_dialog = function(value) {
        var template = 'partials/dialogs/new-ref-' + $scope.ref_selection + '-dialog',
            className = 'ngdialog-theme-default dialogwidth800';

        ngDialog.open({
            template: template,
            controller: 'rgiNewRefDialogCtrl',
            className: className,
            scope: $scope
        });
    };
});