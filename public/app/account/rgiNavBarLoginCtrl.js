'use strict';
var angular;
/*jslint newcap: true*/

angular.module('app').controller('rgiNavBarLoginCtrl', function ($scope, $location, rgiNotifier, rgiIdentitySrvc, rgiAuthSrvc, rgiAssessmentSrvc) {
    // assign the identity resource with the current identity using identity service
    $scope.identity = rgiIdentitySrvc;

    $scope.versions = [{year:'2015', version: 'pilot', name: '2015 Pilot', url: '2015_pilot'}, {year:'2015', version: 'main', name: '2015 Main', url: '2015_main'}];
    // $scope.versions = rgiAssessmentSrvc.query({}, function (data) {
    //     var versions = [];
    //     versions.push('pilot');
    //     console.log(versions.indexOf('pilot'));
    //     // for (var i = 0; i < data.length; i++) {
    //     //     if(versions.contains(data[i].version)) {
    //     //         console.log(data[i].version)
    //     //     }
    //     // };
    //     // data.forEach(function (el, i) {
    //     //     // console.log(el.version);
    //     //     // console.log(el.year);
    //     //     // $scope.versions.push();
    //     //     if (!versions.contains(el.version)) {
    //     //         console.log(el.version);
    //     //     //     // $scope.versions.push({version: el.version, year: el.year});
    //     //     //     $scope.versions.push(el.version);
    //     //     }
    //     // });
    //     return versions;
    //     // console.log(data);
    // });

    // signin function for signin button
    $scope.signin = function (username, password) {
        rgiAuthSrvc.authenticateUser(username, password).then(function (success) {
            if (success) {
                rgiNotifier.notify('You have successfully signed in!');
            } else {
                rgiNotifier.notify('Username/Password combination incorrect');
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