'use strict';

angular.module('app')
    .directive('rgiWysiwyg', function() {
        return {
            restrict: 'EA',
            scope: {
                ngModel: '=',
                disabled: '=',
                name: '@',
                placeholder: '@'
            },
            controller: 'rgiWysiwygCtrl',
            templateUrl: '/partials/directives/templates/rgi-wysiwyg'
        };
    });