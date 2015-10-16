'use strict';

angular
    .module('app')
    .directive('rgiAssessmentsUserTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAssessmentsUserTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/rgi-assessments-user-table'
        };
    });