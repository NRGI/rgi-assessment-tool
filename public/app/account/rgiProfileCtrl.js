angular
    .module('app')
    .controller('rgiProfileCtrl', function (
        $scope,
        $route,
        rgiIdentitySrvc,
        rgiUserMethodSrvc,
        rgiNotifier
    ) {
        'use strict';
        // set page resources to be those of the current identity
        $scope.fullName = rgiIdentitySrvc.currentUser.firstName + " " + rgiIdentitySrvc.currentUser.lastName;
        $scope.current_user = rgiIdentitySrvc.currentUser;
        //$scope.first_name = rgiIdentitySrvc.currentUser.firstName;
        //$scope.last_name = rgiIdentitySrvc.currentUser.lastName;
        //$scope.email = rgiIdentitySrvc.currentUser.email;
        //$scope.username = rgiIdentitySrvc.currentUser.username;
        //$scope.role = rgiIdentitySrvc.currentUser.role;
        //$scope.address = rgiIdentitySrvc.currentUser.address;

        // update functinonality for update button
        $scope.update = function () {
            // pass in update data
            var new_user_data = $scope.current_user;
            // check if password update exists and pass it in
            if ($scope.password && $scope.password.length > 0) {
                if ($scope.password !== $scope.password_rep) {
                    rgiNotifier.error('Passwords must match!');
                } else {
                    new_user_data.password = $scope.password;
                }
            }
            console.log(new_user_data);
            // use authorization service to update user data
            rgiUserMethodSrvc.updateUser(new_user_data).then(function () {
                rgiNotifier.notify('Your user account has been updated');
                $route.reload();
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    });
