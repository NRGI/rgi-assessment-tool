'use strict';

angular.module('app')
    .controller('rgiToggleUserDisabledStatusDialogCtrl', ['$scope', 'rgiUserMethodSrvc', 'rgiNotifier', function (
        $scope,
        rgiUserMethodSrvc,
        rgiNotifier
    ) {
        $scope.toggleUserDisabledStatus = function () {
            var user = $scope.$parent.user;
            user.disabled = !user.disabled;

            rgiUserMethodSrvc.updateUser(user).then(function () {
                rgiNotifier.notify('User account has been ' + (user.disabled ? 'deactivated' : 'activated'));
            }, function (reason) {
                rgiNotifier.error(reason);
                user.disabled = !user.disabled;
            }).finally($scope.closeThisDialog);
        };
    }]);
