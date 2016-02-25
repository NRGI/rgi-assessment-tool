'use strict';

angular.module('app')
    .directive('rgiAssessmentsListTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAssessmentsListTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-assessments-list-table'
        };
    });