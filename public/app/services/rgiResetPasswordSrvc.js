'use strict';

angular.module('app')
    .factory('rgiResetPasswordSrvc', function ($http) {
        return {
            recover: function (email) {
                return $http.post('/api/reset-password-token/add', {email: email});
            },
            reset: function (token, password) {
                return $http.post('/api/reset-password-token/reset', {token: token, password: password});
            }
        };
    });
