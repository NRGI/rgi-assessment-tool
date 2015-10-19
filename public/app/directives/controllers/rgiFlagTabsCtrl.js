'use strict';

angular
    .module('app')
    .controller('rgiFlagTabsCtrl', function (
        $scope,
        rgiDialogFactory
    ) {
        $scope.flagEdit = function (flag, index) {
            rgiDialogFactory.flagEdit($scope, flag, index);
        };
    });