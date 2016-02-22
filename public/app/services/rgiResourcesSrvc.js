'use strict';

angular.module('app')
    .factory('rgiResourcesSrvc', function ($resource) {
        var ResourcesResource = $resource('/api/resources/:_id', {_id: '@id'}, {
            update: {method: 'PUT', isArray: false}
        });

        return ResourcesResource;
    });