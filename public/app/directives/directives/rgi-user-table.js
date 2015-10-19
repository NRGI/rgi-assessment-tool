'use strict';

angular
    .module('app')
    .directive('rgiUserTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiUserTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-user-table'
        };
    });