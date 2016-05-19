'use strict';

angular.module('app')
    .factory('rgiAuthLogsSrvc', function ($http) {
        return {
            getTotalNumber: function(userId) {
                return $http.get('/api/auth-logs/number/' + userId);
            },
            list: function(userId, itemsPerPage, page) {
                return $http.get('/api/auth-logs/list/' + userId + '/' + itemsPerPage + '/' + page);
            },
            getMostRecent: function(userId, action) {
                return $http.get('/api/auth-logs/recent/' + userId + '/' + action);
            }
        };
    });
