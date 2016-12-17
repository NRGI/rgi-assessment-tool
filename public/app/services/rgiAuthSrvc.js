'use strict';

angular.module('app').factory('rgiAuthSrvc', ['$http', '$q', 'rgiHttpResponseProcessorSrvc', 'rgiIdentitySrvc', 'rgiUserSrvc', function (
    $http,
    $q,
    rgiHttpResponseProcessorSrvc,
    rgiIdentitySrvc,
    rgiUserSrvc
) {
    var processHttpFailure = rgiHttpResponseProcessorSrvc.getDefaultHandler();

    return {
        authenticateUser: function (username, password) {
            var dfd = $q.defer();

            $http.post('/login', {username: username, password: password}).then(function (response) {
                if (response.data.success) {
                    var user = new rgiUserSrvc();
                    angular.extend(user, response.data.user);
                    rgiIdentitySrvc.currentUser = user;
                    dfd.resolve(true);
                } else {
                    dfd.resolve(false);
                }
            }, processHttpFailure);

            return dfd.promise;
        },
        logoutUser: function () {
            var dfd = $q.defer();

            $http.post('/logout', {logout: true}).then(function () {
                rgiIdentitySrvc.currentUser = undefined;
                dfd.resolve();
            }, processHttpFailure);

            return dfd.promise;
        },
        authorizeCurrentUserForRoute: function (roles) {
            var authorized = false;

            roles.forEach(function(role) {
                if(rgiIdentitySrvc.isAuthorized(role)) {
                    authorized = true;
                }
            });

            return authorized || $q.reject('not authorized');
        },
        authorizeAuthenticatedUserForRoute: function () {
            return rgiIdentitySrvc.isAuthenticated() ? true : $q.reject('not authorized');
        }
    };
}]);
