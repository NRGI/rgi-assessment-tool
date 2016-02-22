'use strict';

angular.module('app')
    .controller('rgiUserTableCtrl', function ($scope) {
        $scope.current_user = $scope.$root.current_user;
    });