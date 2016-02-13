angular.module('app').factory('rgiUserSrvc', function ($resource) {
    'use strict';
    var UserResource = $resource('/api/users/:_id', {_id: "@id"}, {
        update: {method: 'PUT', isArray: false}
    });

    // add role features to resource
    UserResource.prototype.isRoleAssigned = function (role) {
        return this.role && (this.role === role);
    };

    UserResource.prototype.isSupervisor = function () {
        return this.isRoleAssigned('supervisor');
    };

    UserResource.prototype.isReviewer = function () {
        return this.isRoleAssigned('reviewer');
    };

    UserResource.prototype.isExternalReviewer = function () {
        return this.isRoleAssigned('ext_reviewer');
    };

    UserResource.prototype.isResearcher = function () {
        return this.isRoleAssigned('researcher');
    };

    return UserResource;
});