'use strict';
var angular;

angular.module('app').factory('rgiResetPasswordSrvc', function ($http, $q) {
    return {
        reset: function(token, password) {
            var dfd = $q.defer();

            $http.post('/api/reset-password-token/reset', {token: token, password: password}).then(function (response) {
                dfd.resolve(response);
            }, function() {
                dfd.reject();
            });

            return dfd.promise;
        }
    };
});