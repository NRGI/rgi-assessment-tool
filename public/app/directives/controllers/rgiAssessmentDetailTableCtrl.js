'use strict';
angular.module('app')
    .controller('rgiAssessmentDetailTableCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

    });