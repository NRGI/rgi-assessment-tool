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
        $scope.new_user_data = {};

      // fix submit button functionality
        $scope.userCreate = function () {
            var new_user_data = $scope.new_user_data;
            if (!new_user_data.firstName || !new_user_data.lastName) {
                rgiNotifier.error('You must supply a first and last name!');
            } else if (!new_user_data.email) {
                rgiNotifier.error('You must supply an email!');
            } else if (!new_user_data.email) {
                rgiNotifier.error('You must supply an username!');
            } else {
                rgiUserMethodSrvc.createUser(new_user_data).then(function () {
                    rgiNotifier.notify('User account created! ' + $scope.email);
                    $location.path('/admin/user-admin');
                }, function (reason) {
                    var err_str = reason.replace('Path ','');
                    rgiNotifier.error(err_str+'!');
                });
            }
        };
    });