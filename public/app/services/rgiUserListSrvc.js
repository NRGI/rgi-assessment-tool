'use strict';

angular.module('app')
    .factory('rgiUserListSrvc', function ($resource) {
        return $resource('/api/user-list/:_id', {_id: "@id"}, {
            get: {method : 'GET', cache: true}
        });
    });
