// query users or get user by id and return only first and last name and email
/*global angular */
'use strict';

var app = angular.module('app').factory('rgiUserListSrvc', function ($resource) {
    var UserResource = $resource('/api/user-list/:_id', {_id: "@id"}, {});

    return UserResource;
});