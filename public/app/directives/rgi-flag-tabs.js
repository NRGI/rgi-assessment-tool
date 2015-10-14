'use strict';

angular
    .module('app')
    .directive('rgiFlagTabs', function() {
        return {
            restrict: 'EA',
            controller: 'rgiFlagTabsCtrl',
            scope: true,
            templateUrl: '/partials/directives/rgi-flag-tabs'
        };
    });