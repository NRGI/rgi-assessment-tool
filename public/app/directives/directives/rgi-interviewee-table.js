'use strict';

angular.module('app')
    .directive('rgiIntervieweeTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiIntervieweeTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-interviewee-table'
        };
    });