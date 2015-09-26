angular
    .module('app')
    .controller('rgiEditUserDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiUserMethodSrvc
    ) {
        'use strict';
        $scope.new_user_data = $scope.$parent.user;
        $scope.roles = ['supervisor', 'researcher', 'reviewer'];

        //$scope.intervieweeSave = function (new_interviewee_data) {
        //    // TODO fix save notification
        //    // TODO error check
        //    rgiIntervieweeMethodSrvc.updateInterviewee(new_interviewee_data).then(function () {
        //        rgiNotifier.notify('Interviewee has been updated');
        //        ngDialog.close();
        //    }, function (reason) {
        //        rgiNotifier.error(reason);
        //    });
        //};

        $scope.userUpdate = function () {
            var new_user_data = $scope.user;
            if (!new_user_data.email) {
                rgiNotifier.error('You must enter an email address!');
            } else if (!new_user_data.firstName || !new_user_data.lastName) {
                rgiNotifier.error('You must enter an full name!');
            } else if (!new_user_data.role) {
                rgiNotifier.error('You must enter a role!');
            } else {
                if ($scope.password && $scope.password.length > 0) {
                    if ($scope.password === $scope.password_rep) {
                        new_user_data.password = $scope.password;
                        rgiUserMethodSrvc.updateUser(new_user_data).then(function () {
                            rgiNotifier.notify('User account has been updated');
                            ngDialog.close();
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                    } else {
                        rgiNotifier.error('Passwords must match!');
                    }
                } else {
                    rgiUserMethodSrvc.updateUser(new_user_data).then(function () {
                        rgiNotifier.notify('User account has been updated');
                        ngDialog.close();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
                }
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });