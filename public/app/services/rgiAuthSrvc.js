'use strict';

angular.module('app').factory('rgiAuthSrvc', function (
    $http,
    $q,
    rgiHttpResponseProcessorSrvc,
    rgiIdentitySrvc,
    rgiNotifier,
    rgiUserSrvc
) {
    var processHttpFailure = function(response) {
        rgiHttpResponseProcessorSrvc.handle(response);
        rgiNotifier.error(rgiHttpResponseProcessorSrvc.getMessage(response));
    };

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
        authorizeCurrentUserForRoute: function (role) {
            return rgiIdentitySrvc.isAuthorized(role) ? true : $q.reject('not authorized');
        },
        authorizeAuthenticatedUserForRoute: function () {
            return rgiIdentitySrvc.isAuthenticated() ? true : $q.reject('not authorized');
        }
    };
});
