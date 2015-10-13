'use strict';

angular
    .module('app')
    .directive('rgiComments', function() {
        return {
            restrict: 'EA',
            controller: 'rgiCommentsCtrl',
            scope: {
                update: '='
            },
            templateUrl: '/partials/directives/rgi-comments'
        };
    });