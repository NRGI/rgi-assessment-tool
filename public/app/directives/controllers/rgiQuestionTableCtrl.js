'use strict';

angular.module('app')
    .controller('rgiQuestionTableCtrl', function ($scope) {
        $scope.current_user = $scope.$root.current_user;
    });