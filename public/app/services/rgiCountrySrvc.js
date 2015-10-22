angular.module('app').factory('rgiCountrySrvc', function ($resource) {
    'use strict';
    var CountryResource = $resource('/api/countries/:country_ID', {country_ID: '@country_ID'}, {
        update: {method: 'PUT', isArray: false}
    });

    return CountryResource;
});
