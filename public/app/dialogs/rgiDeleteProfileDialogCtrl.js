'use strict';
//var angular;
/*jslint nomen: true newcap: true unparam: true*/

angular.module('app').controller('rgiDeleteProfileDialogCtrl', function ($scope, $location, ngDialog, rgiUserMethodSrvc, rgiNotifier) {
    $scope.userDelete = function () {
        var user_deletion = $scope.$parent.user._id;

        rgiUserMethodSrvc.deleteUser(user_deletion).then(function () {
            $scope.closeThisDialog();
            $location.path('/admin/user-admin');
            rgiNotifier.notify('User account has been deleted');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };
    $scope.closeDialog = function () {
        ngDialog.close();
    };
});
