'use strict';
var angular;
angular.module('app').factory('rgiAuthSrvc', function ($http, $q, rgiIdentitySrvc, rgiUserSrvc) {
    return {
        // AUTHENTICATION AND AUTHORIZATION
        //authentication
        authenticateUser: function (username, password) {
            var dfd = $q.defer();
            // var req = {
            //     method: 'POST',
            //     url: 'https://api.mendeley.com/oauth/token',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'Allow-Control-Allow-Origin': '*'
            //     },
            //     data: {
            //         grant_type: 'client_credentials',
            //         scope: 'all',
            //         client_id: '1550:VQbBkpTHww0mL5ue'
            //     }
            // };
            // $http(req).success(function (res, err) {
            //     console.log(res);
            // })
            //     .error(function (err) {
            //         console.log(err);
            //     });
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

            // $http.post('https://api.mendeley.com/oauth/token', )
            // token=$(-u 1550:LVGVkcbkqiZLFg3B -d "grant_type=client_credentials&scope=all" https://api.mendeley.com/oauth/token | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["access_token"]')

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
            } else {
                return $q.reject('not authorized');
            }
        },
        //limit route to authenticated users
        authorizeAuthenticatedUserForRoute: function () {
            if (rgiIdentitySrvc.isAuthenticated()) {
                return true;
            } else {
                return $q.reject('not authorized');
            }
        }
    };
});