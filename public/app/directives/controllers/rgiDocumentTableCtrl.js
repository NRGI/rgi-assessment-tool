'use strict';

angular.module('app')
    .controller('rgiDocumentTableCtrl', function ($scope) {
        $scope.current_user = $scope.$root.current_user;
    });