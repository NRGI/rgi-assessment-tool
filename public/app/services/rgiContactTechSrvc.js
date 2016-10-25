angular.module('app').factory('rgiContactTechSrvc', ['$resource', function ($resource) {
    'use strict';
    var ContactResource = $resource('/contact_tech', {}, {});

    return ContactResource;
}]);
