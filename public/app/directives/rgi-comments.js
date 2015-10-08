'use strict';

angular
    .module('app')
    .directive('rgiComments', function() {
        return {
            restrict: 'EA',
            controller: 'rgiCommentsCtrl',
            scope: true,
            templateUrl: '/partials/directives/rgi-comments'
        };
    });