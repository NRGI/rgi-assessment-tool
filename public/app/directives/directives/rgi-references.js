'use strict';

angular.module('app')
    .directive('rgiReferences', function() {
        return {
            restrict: 'EA',
            controller: 'rgiReferencesCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-references'
        };
    });