'use strict';

angular.module('app').factory('rgiDocumentSrvc', function ($resource) {
    return $resource('/api/documents/:limit/:skip/:_id', {_id: '@id', limit: "@limit", skip: "@skip"}, {
        query: {method:'GET', isArray: false},
        get: {method: 'GET', cache: true},
        update: {method: 'PUT', isArray: false}
    });
});