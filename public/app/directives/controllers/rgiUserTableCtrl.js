'use strict';

angular.module('app')
    .controller('rgiUserTableCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    });