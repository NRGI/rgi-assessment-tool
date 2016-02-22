'use strict';

angular.module('app')
    .directive('rgiAnswerForm', function() {
        return {
            restrict: 'EA',
            controller: 'rgiAnswerFormCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-answer-form'
        };
    });