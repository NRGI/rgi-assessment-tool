'use strict';

angular.module('app')
    .controller('rgiProfileCtrl', function (
        $scope,
        $route,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiUserMethodSrvc
    ) {
        // set page resources to be those of the current identity
        $scope.fullName = $scope.current_user.firstName + " " + $scope.current_user.lastName;

        // update functinonality for update button
        $scope.update = function () {
            var new_user_data = $scope.current_user;
            if (!new_user_data.firstName || !new_user_data.lastName) {
                rgiNotifier.error('You must supply a first and last name!');
            } else if (!new_user_data.email) {
                rgiNotifier.error('You must supply an email!');
            } else {
                // check if password update exists and pass it in
                if ($scope.password && $scope.password.length > 0) {
                    if ($scope.password !== $scope.password_rep) {
                        rgiNotifier.error('Passwords must match!');
                    } else {
                        new_user_data.password = $scope.password;
                    }
                }
                // use authorization service to update user data
                rgiUserMethodSrvc.updateUser(new_user_data).then(function () {
                    rgiNotifier.notify('Your user account has been updated');
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };
    });
