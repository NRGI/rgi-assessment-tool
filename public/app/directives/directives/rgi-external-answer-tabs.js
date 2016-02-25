'use strict';

angular.module('app')
    .directive('rgiExternalAnswerTabs', function() {
        return {
            restrict: 'EA',
            controller: 'rgiExternalAnswerTabsCtrl',
            scope: {
                answer: '='
            },
            templateUrl: '/partials/directives/templates/rgi-external-answer-tabs'
        };
    });