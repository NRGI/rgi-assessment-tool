'use strict';

angular.module('app').factory('rgiDocumentSrvc', ['$resource', function ($resource) {
    return $resource('/api/documents/:limit/:skip/:_id', {_id: '@id', limit: "@limit", skip: "@skip"}, {
        query: {method:'GET', isArray: false},
        queryCached: {method:'GET', isArray: false, cache: true},
        get: {method: 'GET', cache: true},
        update: {method: 'PUT', isArray: false}
    });
}]);