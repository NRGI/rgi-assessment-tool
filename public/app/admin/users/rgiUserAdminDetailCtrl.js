'use strict';
var angular;
/*jslint nomen: true*/

angular.module('app').controller('rgiUserAdminDetailCtrl', function ($scope, $routeParams, $location, rgiNotifier, rgiUserSrvc, rgiUserMethodSrvc) {

    $scope.user = rgiUserSrvc.get({_id: $routeParams.id});

    $scope.userUpdate = function () {
        var new_user_data = $scope.user;

        if ($scope.password && $scope.password.length > 0) {
            if ($scope.password === $scope.password_rep) {
                new_user_data.password = $scope.password;
                rgiUserMethodSrvc.updateUser(new_user_data).then(function () {
                    rgiNotifier.notify('User account has been updated');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            } else {
                rgiNotifier.error('Passwords must match!');
            }
        } else {
            rgiUserMethodSrvc.updateUser(new_user_data).then(function () {
                rgiNotifier.notify('User account has been updated');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        }
    };

    $scope.userDelete = function () {
        var user_deletion = $scope.user._id;

        rgiUserMethodSrvc.deleteUser(user_deletion).then(function () {
            $location.path('/admin/user-admin');
            rgiNotifier.notify('User account has been deleted');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };
});