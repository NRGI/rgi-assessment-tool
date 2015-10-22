angular.module('app').factory('rgiContactTechSrvc', function ($resource) {
    'use strict';
    var ContactResource = $resource('/contact_tech', {}, {});

    return ContactResource;
});
