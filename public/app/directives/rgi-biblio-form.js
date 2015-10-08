'use strict';

angular
    .module('app')
    .directive('rgiBiblioForm', function() {
        return {
            restrict: 'EA',
            controller: 'rgiBiblioFormCtrl',
            scope: true,
            templateUrl: '/partials/directives/rgi-biblio-form'
        };
    });