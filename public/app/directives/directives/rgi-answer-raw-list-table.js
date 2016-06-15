'use strict';

angular.module('app')
    .directive('rgiAnswerRawListTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAnswerRawListTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-answer-raw-list-table'
        };
    });