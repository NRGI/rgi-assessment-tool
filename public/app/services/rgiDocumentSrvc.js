'use strict';

angular.module('app').factory('rgiDocumentSrvc', function ($resource) {
    return $resource('/api/documents/:_id', {_id: '@id'}, {
        get: {method: 'GET', cache: true},
        update: {method: 'PUT', isArray: false}
    });
});