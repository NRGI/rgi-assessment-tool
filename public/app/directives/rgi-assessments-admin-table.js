'use strict';

angular
    .module('app')
    .directive('rgiAssessmentsAdminTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAssessmentsAdminTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/rgi-assessments-admin-table'
        };
    });