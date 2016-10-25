'use strict';

angular.module('app').factory('rgiResourcesSrvc', ['$resource', function ($resource) {
    return $resource('/api/resources/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false}
    });
}]);
