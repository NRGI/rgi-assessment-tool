'use strict';
angular.module('app')
    .controller('rgiEditUserDialogCtrl', function (
        $scope,
        $route,
        $timeout,
        rgiNotifier,
        rgiUserMethodSrvc,
        HUMAN_NAME_PATTERN,
        PASSWORD_PATTERN
    ) {
        $scope.new_user_data = $scope.$parent.user;
        $scope.roles = ['supervisor', 'researcher', 'reviewer', 'ext_reviewer'];

        $scope.humanNamePattern = HUMAN_NAME_PATTERN;
        $scope.passwordPattern = PASSWORD_PATTERN;

        var timeoutId;

        $scope.checkPassword = function() {
            if(timeoutId !== undefined) {
                $timeout.cancel(timeoutId);
            }

            if($scope.profileForm.password.$invalid) {
                timeoutId = $timeout(function() {
                    rgiNotifier.error('The password should consist of 6-8 characters including at least one digit, ' +
                    'at least one lower-case letter, at least one upper-case letter and at least one special character');
                }, 1000);
            }
        };

        $scope.checkPasswordsMatch = function(skipTouchedCheck) {
            if($scope.profileForm.password.$valid && (skipTouchedCheck || $scope.profileForm.password_rep.$touched)) {
                $scope.profileForm.password_rep.$setValidity('matched', $scope.password === $scope.password_rep);
            }
        };

        var updateUser = function(userData) {
            rgiUserMethodSrvc.updateUser(userData).then(function () {
                rgiNotifier.notify('User account has been updated');
                $route.reload();
            }, function (reason) {
                rgiNotifier.error(reason);
            }).finally($scope.closeThisDialog);
        };

        $scope.update = function () {
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
