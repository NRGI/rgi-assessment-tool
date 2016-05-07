'use strict';

angular.module('app')
    .controller('rgiDeleteUserDialogCtrl', function (
        $scope,
        $location,
        rgiUserMethodSrvc,
        rgiNotifier
    ) {
        $scope.deleteUser = function () {
            var user = $scope.$parent.user;

            if (user.assessments.length > 0) {
                rgiNotifier.error('You cannot delete a user with an assigned assessment!');
            } else {
                rgiUserMethodSrvc.deleteUser(user._id).then(function () {
                    $location.path('/admin/user-admin');
                    rgiNotifier.notify('User account has been deleted');
                }, function (reason) {
                    rgiNotifier.error(reason);
                }).finally($scope.closeThisDialog);
            }
        };
    });
