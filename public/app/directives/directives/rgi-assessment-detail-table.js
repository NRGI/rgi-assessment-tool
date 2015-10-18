'use strict';

angular
    .module('app')
    .directive('rgiAssessmentDetailTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAssessmentDetailTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-assessment-detail-table'
        };
    });