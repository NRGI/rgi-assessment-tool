'use strict';
var angular;
/*jslint newcap: true unparam: true*/

angular.module('app').controller('rgiNavBarLoginCtrl', function ($scope, $route, $location, rgiNotifier, rgiIdentitySrvc, rgiAuthSrvc, rgiAssessmentSrvc) {
    // assign the identity resource with the current identity using identity service
    $scope.identity = rgiIdentitySrvc;
    $scope.versions = [];
    var url_array = [];
    if (rgiIdentitySrvc.currentUser !== undefined && rgiIdentitySrvc.currentUser.role === 'supervisor') {

        rgiAssessmentSrvc.query({}, function (data) {
            data.forEach(function (el, i) {
                if (url_array.indexOf(el.year + '_' + el.version) < 0) {
                    url_array.push(el.year + '_' + el.version);
                    $scope.versions.push({
                        year: el.year,
                        version: el.version,
                        name: el.year + ' ' + el.version.charAt(0).toUpperCase() + el.version.slice(1),
                        url: el.year + '_' + el.version
                    });
                }
            });
        });
    }

    // signin function for signin button
    $scope.signin = function (username, password) {
        rgiAuthSrvc.authenticateUser(username, password).then(function (success) {
            $scope.versions = [];
            if (success) {
                if (rgiIdentitySrvc.currentUser !== undefined && rgiIdentitySrvc.currentUser.role === 'supervisor') {
                    var url_array = [];
                    rgiAssessmentSrvc.query({}, function (data) {
                        data.forEach(function (el, i) {
                            if (url_array.indexOf(el.year + '_' + el.version) < 0) {
                                url_array.push(el.year + '_' + el.version);
                                $scope.versions.push({
                                    year: el.year,
                                    version: el.version,
                                    name: el.year + ' ' + el.version.charAt(0).toUpperCase() + el.version.slice(1),
                                    url: el.year + '_' + el.version
                                });
                            }
                        });
                    });
                }
                rgiNotifier.notify('You have successfully signed in!');
                $location.path('/');
            } else {
                rgiNotifier.error('Username/Password combination incorrect');
            }
        });
    };
    // signout function for signout button
    $scope.signout = function () {
        rgiAuthSrvc.logoutUser().then(function () {
            $scope.username = "";
            $scope.password = "";
            rgiNotifier.notify('You have successfully signed out!');
            $location.path('/');
        });
    };
});
