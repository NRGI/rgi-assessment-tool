'use strict';

angular.module('app')
    .directive('rgiAuthLogs', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAuthLogsCtrl',
            scope: {
                user: '='
            },
            templateUrl: '/partials/directives/templates/rgi-auth-logs'
        };
    })
;