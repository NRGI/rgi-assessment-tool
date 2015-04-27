'use strict';
var angular;

// query documents or get documents by id
angular.module('app').factory('rgiDocumentSrvc', function ($resource) {
    var DocumentResource = $resource('/api/documents/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false}
    });

    return DocumentResource;
});
