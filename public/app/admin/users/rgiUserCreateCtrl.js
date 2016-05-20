'use strict';

angular.module('app')
    .controller('rgiUserCreateCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        rgiUserMethodSrvc,
        AVAILABLE_ROLES_SET,
        HUMAN_NAME_PATTERN
    ) {
        $scope.roles = AVAILABLE_ROLES_SET;
        $scope.new_user_data = {};
        $scope.humanNamePattern = HUMAN_NAME_PATTERN;

<<<<<<< HEAD
      // fix submit button functionality
        $scope.userCreate = function () {
            var new_user_data = $scope.new_user_data;
            if (!new_user_data.firstName || !new_user_data.lastName) {
                rgiNotifier.error('You must supply a first and last name!');
            } else if (!new_user_data.email) {
                rgiNotifier.error('You must supply an email!');
            } else if (!new_user_data.username) {
                rgiNotifier.error('You must supply an username!');
            } else if (!new_user_data.role) {
                rgiNotifier.error('You must select a role!');
            } else {
                rgiUserMethodSrvc.createUser(new_user_data).then(function () {
                    rgiNotifier.notify('User account created! ' + new_user_data.email);
                    $location.path('/admin/user-admin');
                }, function (reason) {
                    var err_str = reason.replace('Path ','');
                    rgiNotifier.error(err_str+'!');
                });
            }
        };
    });
=======
  // fix submit button functionality
    $scope.userCreate = function () {
        if ($scope.password !== $scope.password_repeat) {
            rgiNotifier.error('Passwords must match!')
        } else {
            var new_user_data = {
                firstName: $scope.first_name,
                lastName: $scope.last_name,
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                // ADD ROLE IN CREATION EVENT
                role: $scope.roleSelect,
                address: [$scope.address]
            };

            rgiUserMethodSrvc.createUser(new_user_data).then(function () {
                rgiNotifier.notify('User account created!' + $scope.email);
                $location.path('/admin/user-admin');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        }
    };
});
>>>>>>> a36829db08c82844e4c05cf309557594404f579b
