'use strict';

angular.module('app')
    .controller('rgiDeleteResourceDialogCtrl', function (
        $scope,
        $route,
        rgiNotifier,
        rgiResourcesMethodSrvc
    ) {
        $scope.deleteResource = function () {
            rgiResourcesMethodSrvc.deleteResource($scope.$parent.resource._id).then(function () {
                $scope.closeThisDialog();
                $route.reload();
                rgiNotifier.notify('Resource has been deleted');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    });
