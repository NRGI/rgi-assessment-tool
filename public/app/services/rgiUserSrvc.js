angular.module('app').factory('rgiUserSrvc', function ($resource) {
    'use strict';
    var UserResource = $resource('/api/users/:_id', {_id: "@id"}, {
        update: {method: 'PUT', isArray: false}
    });

    // add role features to resource
    UserResource.prototype.isSupervisor = function () {
        return this.role && this.role === 'supervisor';
    };

    UserResource.prototype.isReviewer = function () {
        return this.role && this.role === 'reviewer';
    };

    UserResource.prototype.isResearcher = function () {
        return this.role && this.role === 'researcher';
    };

    return UserResource;
});