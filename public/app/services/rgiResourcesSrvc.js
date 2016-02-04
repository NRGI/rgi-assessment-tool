angular.module('app').factory('rgiResourcesSrvc', function ($resource) {
    'use strict';
    var ResourcesResource = $resource('/api/resources/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false}
    });

    return ResourcesResource;
});