angular
    .module('app')
    .controller('rgiProfileCtrl', function (
        $scope,
        rgiIdentitySrvc,
        rgiUserMethodSrvc,
        rgiNotifier
    ) {
        'use strict';
        // set page resources to be those of the current identity
        $scope.fullName = rgiIdentitySrvc.currentUser.firstName + " " + rgiIdentitySrvc.currentUser.lastName;
        $scope.first_name = rgiIdentitySrvc.currentUser.firstName;
        $scope.last_name = rgiIdentitySrvc.currentUser.lastName;
        $scope.email = rgiIdentitySrvc.currentUser.email;
        $scope.username = rgiIdentitySrvc.currentUser.username;
        $scope.role = rgiIdentitySrvc.currentUser.role;
        $scope.address = rgiIdentitySrvc.currentUser.address;

        // update functinonality for update button
        $scope.update = function () {
            // pass in update data
            var newUserData = {
                firstName: $scope.first_name,
                lastName: $scope.last_name,
                email: $scope.email,
                address: $scope.address
            };
            // check if password update exists and pass it in
            if ($scope.password && $scope.password.length > 0) {
                if ($scope.password !== $scope.password_rep) {
                    rgiNotifier.error('Passwords must match!');
                } else {
                    newUserData.password = $scope.password;
                }
            }
            // use authorization service to update user data
            rgiUserMethodSrvc.updateUser(newUserData).then(function () {
                rgiNotifier.notify('Your user account has been updated');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    });
