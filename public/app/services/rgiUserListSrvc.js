angular.module('app').factory('rgiUserListSrvc', function ($resource) {
    'use strict';
    var UserResource = $resource('/api/user-list/:_id', {_id: "@id"}, {});

    return UserResource;
});