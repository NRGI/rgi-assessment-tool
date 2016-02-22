'use strict';

angular.module('app')
    .controller('rgiPrevAnswersCtrl', function ($scope) {
        $scope.current_user = $scope.$root.current_user;
    });