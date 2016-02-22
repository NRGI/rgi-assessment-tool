'use strict';

angular.module('app')
    .controller('rgiFlagTabsCtrl', function (
        $scope,
        rgiDialogFactory
    ) {
        $scope.current_user = $scope.$root.current_user;
        $scope.flagEdit = function (flag, index) {
            rgiDialogFactory.flagEdit($scope, flag, index);
        };
    });