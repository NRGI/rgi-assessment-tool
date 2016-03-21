'use strict';

angular.module('app')
    .directive('rgiCalendar', function() {
        return {
            restrict: 'EA',
            controller: 'rgiCalendarCtrl',
            scope: {
                ngModel: '=',
                placeholder: '@'
            },
            templateUrl: '/partials/directives/templates/rgi-calendar'
        };
    });