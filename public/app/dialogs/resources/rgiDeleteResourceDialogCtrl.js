'use strict';

angular.module('app')
    .controller('rgiDeleteResourceDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiResourcesMethodSrvc,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.resourceDelete = function () {
            var resource_deletion = $scope.$parent.resource._id;


            rgiResourcesMethodSrvc.deleteResource(resource_deletion).then(function () {
                $scope.closeThisDialog();
                $route.reload();
                rgiNotifier.notify('Question has been deleted');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });