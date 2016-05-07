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
