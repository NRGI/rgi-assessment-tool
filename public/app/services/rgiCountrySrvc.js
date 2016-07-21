'use strict';

angular.module('app').factory('rgiCountrySrvc', function ($resource) {
    return $resource('/api/countries/:country_ID', {country_ID: '@country_ID'}, {
        update: {method: 'PUT', isArray: false}
    });
});
