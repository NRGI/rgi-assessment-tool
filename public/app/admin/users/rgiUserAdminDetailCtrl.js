'use strict';
//var angular;
/*jslint nomen: true*/

angular.module('app').controller('rgiUserAdminDetailCtrl', function ($scope, $routeParams, $location, ngDialog, rgiNotifier, rgiUserSrvc, rgiUserMethodSrvc) {

    $scope.user = rgiUserSrvc.get({_id: $routeParams.id});
    $scope.role_options = [
        // {value: 'admin', text: 'Administrator'},
        {value: 'supervisor', text: 'Supervisor'},
        {value: 'researcher', text: 'Researcher'},
        {value: 'reviewer', text: 'Reviewer'}
    ];

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
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
                } else {
                    rgiNotifier.error('Passwords must match!');
                }
            } else {
                rgiUserMethodSrvc.updateUser(new_user_data).then(function () {
                    rgiNotifier.notify('User account has been updated');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        }
    };
    $scope.deleteConfirmDialog = function () {
        $scope.value = true;
        ngDialog.open({
            template: 'partials/dialogs/delete-profile-confirmation-dialog',
            controller: 'rgiDeleteProfileDialogCtrl',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    //$scope.userDelete = function () {
    //    var user_deletion = $scope.user._id;
    //
    //    rgiUserMethodSrvc.deleteUser(user_deletion).then(function () {
    //        $location.path('/admin/user-admin');
    //        rgiNotifier.notify('User account has been deleted');
    //    }, function (reason) {
    //        rgiNotifier.error(reason);
    //    });
    //};
});
