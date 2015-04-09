'use strict';
var angular;
/*jslint newcap: true */

angular.module('app').factory('rgiAuthSrvc', function ($http, $q, rgiIdentitySrvc, rgiUserSrvc) {
    return {
        // AUTHENTICATION AND AUTHORIZATION
        //authentication
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
            });
            return dfd.promise;
        },
        //logout
        logoutUser: function () {
            var dfd = $q.defer();
            $http.post('/logout', {logout: true}).then(function () {
                rgiIdentitySrvc.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        //authorize for specific route based on role
        authorizeCurrentUserForRoute: function (role) {
            if (rgiIdentitySrvc.isAuthorized(role)) {
                return true;
            }
            if (!rgiIdentitySrvc.isAuthorized(role)) {
                return $q.reject('not authorized');
            }
        },
        //limit route to authenticated users
        authorizeAuthenticatedUserForRoute: function () {
            if (rgiIdentitySrvc.isAuthenticated()) {
                return true;
            }
            if (!rgiIdentitySrvc.isAuthenticated()) {
                return $q.reject('not authorized');
            }
        }
    };
});