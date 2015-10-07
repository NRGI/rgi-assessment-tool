'use strict';

angular
    .module('app')
    .directive('rgiAnswerNav', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAnswerNavCtrl',
            scope: {
                answer: '='
            },
            templateUrl: '/partials/directives/rgi-answer-nav'
        };
    });