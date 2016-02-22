'use strict';

angular.module('app')
    .controller('rgiIntervieweeTableCtrl', function ($scope) {
        $scope.current_user = $scope.$root.current_user;
    });