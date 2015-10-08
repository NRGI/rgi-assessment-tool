'use strict';

angular
    .module('app')
    .directive('rgiPrevAnswers', function() {
        return {
            restrict: 'EA',
            controller: 'rgiPrevAnswersCtrl',
            scope: true,
            templateUrl: '/partials/directives/rgi-prev-answers'
        };
    });