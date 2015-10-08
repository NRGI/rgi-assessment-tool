'use strict';

angular
    .module('app')
    .directive('rgiActiveAnswerButtons', function() {
        return {
            restrict: 'EA',
            controller: 'rgiActiveAnswerButtonsCtrl',
            scope: true,
            templateUrl: '/partials/directives/rgi-active-answer-buttons'
        };
    });