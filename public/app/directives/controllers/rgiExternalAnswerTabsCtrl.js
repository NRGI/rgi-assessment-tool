'use strict';

angular.module('app')
    .controller('rgiExternalAnswerTabsCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        console.log($scope);
        //$scope.flagEdit = function (flag, index) {
        //    rgiDialogFactory.flagEdit($scope, flag, index);
        //};
    });