/*global angular */
'use strict';

var app = angular.module('app').controller('rgiProfileCtrl', function ($scope, rgiIdentitySrvc, rgiUserMethodSrvc, rgiNotifier) {
    // set page resources to be those of the current identity
    $scope.full_name = rgiIdentitySrvc.currentUser.firstName + " " + rgiIdentitySrvc.currentUser.lastName;
    $scope.first_name = rgiIdentitySrvc.currentUser.firstName;
    $scope.last_name = rgiIdentitySrvc.currentUser.lastName;
    $scope.email = rgiIdentitySrvc.currentUser.email;
    $scope.username = rgiIdentitySrvc.currentUser.username;
    $scope.roles = rgiIdentitySrvc.currentUser.roles;
    // update functinonality for update button
    $scope.update = function () {
        // pass in update data
        var newUserData = {
            firstName: $scope.first_name,
            lastName: $scope.last_name,
            email: $scope.email
        };
        // check if password update exists and pass it in
        if ($scope.password && $scope.passowrd.length > 0) {
            newUserData.password = $scope.password;
        }
        // use authorization service to update user data
        rgiUserMethodSrvc.updateCurrentUser(newUserData).then(function () {
            rgiNotifier.notify('Your user account has been updated');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };
});
