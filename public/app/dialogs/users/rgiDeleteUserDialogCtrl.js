angular
    .module('app')
    .controller('rgiDeleteUserDialogCtrl', function (
        $scope,
        $location,
        ngDialog,
        rgiUserMethodSrvc,
        rgiNotifier
    ) {
        'use strict';
        $scope.userDelete = function () {
            var user_deletion = $scope.$parent.user;

            if (user_deletion.assessments.length > 0) {
                rgiNotifier.error('You cannot delete a user with an assigned assessment!');
            } else if (user_deletion.role === 'supervisor') {
                rgiNotifier.error('You cannot delete a supervisor!');
            } else {
                rgiUserMethodSrvc.deleteUser(user_deletion._id).then(function () {
                    $scope.closeDialog();
                    $location.path('/admin/user-admin');
                    rgiNotifier.notify('User account has been deleted');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };
        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });