'use strict';
var angular;
// contact tech support
angular.module('app').factory('rgiContactSrvc', function ($resource) {
    var ContactResource = $resource('/contact', {}, {});

    return ContactResource;
});
