'use strict';

angular.module('app')
    .controller('rgiExternalAnswerTabsCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
    });