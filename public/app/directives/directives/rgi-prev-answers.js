'use strict';

angular.module('app')
    .directive('rgiPrevAnswers', function() {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-prev-answers'
        };
    });
