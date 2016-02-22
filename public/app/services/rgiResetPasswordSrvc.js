'use strict';
angular.module('app')
    .factory('rgiResetPasswordSrvc', function (rgiRequestSubmitterSrvc) {
        return {
            recover: function (email) {
                return rgiRequestSubmitterSrvc.submit('/api/reset-password-token/add', {email: email});
            },
            reset: function (token, password) {
                return rgiRequestSubmitterSrvc.submit('/api/reset-password-token/reset', {token: token, password: password});
            }
        };
    });