'use strict';

angular.module('app')
    .controller('rgiAnswerFormCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    });
