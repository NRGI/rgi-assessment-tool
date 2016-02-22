'use strict';

angular.module('app')
    .controller('rgiAnswerFormCtrl', function ($scope) {
        $scope.current_user = $scope.$root.current_user;
        $scope.editorContentMaxLength = $scope.$root.editorContentMaxLength;
        $scope.taToolbarOptions = $scope.$root.taToolbarOptions;
    });