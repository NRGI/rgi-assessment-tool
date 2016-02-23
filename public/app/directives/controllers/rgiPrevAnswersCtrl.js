'use strict';

angular.module('app')
    .controller('rgiPrevAnswersCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    });