angular.module('app').factory('rgiDocumentSrvc', function ($resource) {
    'use strict';
    var DocumentResource = $resource('/api/documents/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false}
    });

    return DocumentResource;
});