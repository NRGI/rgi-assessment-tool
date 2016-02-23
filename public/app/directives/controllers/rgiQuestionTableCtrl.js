'use strict';

angular.module('app')
    .controller('rgiQuestionTableCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    });