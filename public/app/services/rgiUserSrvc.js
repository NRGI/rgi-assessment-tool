'use strict';
var angular;
// query user or get user by id
angular.module('app').factory('rgiUserSrvc', function ($resource) {
    var UserResource = $resource('/api/users/:_id', {_id: "@id"}, {
        update: {method: 'PUT', isArray: false}
    });

    // add role features to resource
    UserResource.prototype.isSupervisor = function () {
        return this.roles && this.roles.indexOf('supervisor') > -1;
    };

    UserResource.prototype.isReviewer = function () {
        return this.roles && this.roles.indexOf('reviewer') > -1;
    };

    UserResource.prototype.isResearcher = function () {
        return this.roles && this.roles.indexOf('researcher') > -1;
    };

    return UserResource;
});