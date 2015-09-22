angular
    .module('app')
    .controller('rgiUserCreateCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        rgiUserMethodSrvc
    ) {
        'use strict';
        $scope.role_options = [
            //{value: 'admin', text: 'Administrator'},
            {value: 'supervisor', text: 'Supervisor'},
            {value: 'researcher', text: 'Researcher'},
            {value: 'reviewer', text: 'Reviewer'}
        ];

      // fix submit button functionality
        $scope.userCreate = function () {
            var newUserData = {
                firstName: $scope.first_name,
                lastName: $scope.last_name,
                username: $scope.username,
                email: $scope.email,
                // ADD ROLE IN CREATION EVENT
                role: $scope.roleSelect,
                address: [$scope.address]
            };

            rgiUserMethodSrvc.createUser(newUserData).then(function () {
                rgiNotifier.notify('User account created!' + $scope.email);
                $location.path('/admin/user-admin');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    });