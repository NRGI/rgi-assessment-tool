'use strict';

angular
    .module('app')
    .directive('rgiQuestionTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiQuestionTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-question-table'
        };
    });