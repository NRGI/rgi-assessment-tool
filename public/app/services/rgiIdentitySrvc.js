angular.module('app').factory('rgiIdentitySrvc', ['$window', 'rgiUserSrvc', function ($window, rgiUserSrvc) {
    'use strict';
    var currentUser;
    // bootstrapped object to keep session alive
    if (!!$window.bootstrappedUserObject) {
        currentUser = new rgiUserSrvc();
        angular.extend(currentUser, $window.bootstrappedUserObject);
    }
    return {
        currentUser: currentUser,
        // authentication test
        isAuthenticated: function () {
            return !!this.currentUser;
        },
        // role authorization test
        isAuthorized: function (role) {
            return !!this.currentUser && this.currentUser.role === role;
        }
    };
}]);