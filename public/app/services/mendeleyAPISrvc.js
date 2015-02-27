// Service to query Mendely API
'use strict';
var angular;
angular.module('app').factory('mendeleyAPISrvc', function ($resource, $http) {
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common.Authorization = 'Bearer MSwxNDI1MDU5ODE0NzQzLDI3NTA5OTUzMSwxMDI4LGFsbCwsNzRqcWlHSjN3elhHM2F1UkxaTHhRYzdoZXh3';

    var CitationResource = $resource('https://api.mendeley.com/catalog?doi=:id', {answer_ID: '@answer_ID'}, {
        pull: {method: 'GET', isArray: true}
    });

    return CitationResource;
});


    // var test_cite = $resource('https://api.mendeley.com/catalog?doi=:id', {id: '@id'});