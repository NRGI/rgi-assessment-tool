'use strict';

angular.module('app')
    .controller('rgiDocumentTableCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    });