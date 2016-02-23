'use strict';

angular.module('app')
    .controller('rgiIntervieweeTableCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    });