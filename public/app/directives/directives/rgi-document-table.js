'use strict';

angular
    .module('app')
    .directive('rgiDocumentTable', function() {
        return {
            restrict: 'EA',
            controller: 'rgiDocumentTableCtrl',
            scope: true,
            templateUrl: '/partials/directives/templates/rgi-document-table'
        };
    });