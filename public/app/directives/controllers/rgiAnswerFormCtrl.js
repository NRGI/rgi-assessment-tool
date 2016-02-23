'use strict';

angular.module('app')
    .controller('rgiAnswerFormCtrl', function (
        $scope,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.editorContentMaxLength = $scope.$root.editorContentMaxLength;
        $scope.taToolbarOptions = $scope.$root.taToolbarOptions;
    });