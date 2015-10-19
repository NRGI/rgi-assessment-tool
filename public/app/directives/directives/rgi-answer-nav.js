'use strict';

angular
    .module('app')
    .directive('rgiAnswerNav', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAnswerNavCtrl',
            scope: {
                assessment: '='
            },
            templateUrl: '/partials/directives/templates/rgi-answer-nav'
        };
    });