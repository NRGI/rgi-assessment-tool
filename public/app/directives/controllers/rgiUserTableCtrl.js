'use strict';

angular.module('app')
    .controller('rgiUserTableCtrl', ['$scope', 'rgiIdentitySrvc', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    }]);