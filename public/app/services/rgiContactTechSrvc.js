'use strict';
var angular;
// contact tech support
angular.module('app').factory('rgiContactTechSrvc', function ($resource) {
    var ContactResource = $resource('/contact_tech', {}, {});

    return ContactResource;
});
