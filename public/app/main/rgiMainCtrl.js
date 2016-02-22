'use strict';

angular.module('app')
    .controller('rgiMainCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {

        // bring in current user data to customize front page
        if (rgiIdentitySrvc === '') {
            $scope.fullName = rgiIdentitySrvc.currentUser.firstName + " " + rgiIdentitySrvc.currentUser.lastName;
            $scope.role = rgiIdentitySrvc.currentUser.role;
        }
    });