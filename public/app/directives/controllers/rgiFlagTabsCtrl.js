'use strict';

angular.module('app')
    .controller('rgiFlagTabsCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.flagEdit = function (flag, index) {
            rgiDialogFactory.flagEdit($scope, flag, index);
        };
    });