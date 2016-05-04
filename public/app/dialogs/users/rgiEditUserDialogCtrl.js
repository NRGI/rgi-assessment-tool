'use strict';
angular.module('app')
    .controller('rgiEditUserDialogCtrl', function (
        $scope,
        $route,
        rgiNotifier,
        rgiUserMethodSrvc
    ) {
        $scope.new_user_data = $scope.$parent.user;
        $scope.roles = ['supervisor', 'researcher', 'reviewer', 'ext_reviewer'];

        var updateUser = function(userData) {
            rgiUserMethodSrvc.updateUser(userData).then(function () {
                rgiNotifier.notify('User account has been updated');
                $scope.closeThisDialog();
                $route.reload();
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.updateUser = function () {
            var new_user_data = $scope.user;
            if (!new_user_data.email) {
                rgiNotifier.error('You must enter an email address!');
            } else if (!new_user_data.firstName || !new_user_data.lastName) {
                rgiNotifier.error('You must enter an first and last name!');
            } else if (!new_user_data.role) {
                rgiNotifier.error('You must enter a role!');
            } else {
                if ($scope.password && $scope.password.length > 0) {
                    if ($scope.password === $scope.password_rep) {
                        new_user_data.password = $scope.password;
                        updateUser(new_user_data);
                    } else {
                        rgiNotifier.error('Passwords must match!');
                    }
                } else {
                    updateUser(new_user_data);
                }
            }
        };
    });
