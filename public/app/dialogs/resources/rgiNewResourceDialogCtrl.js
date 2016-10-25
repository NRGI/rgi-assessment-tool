'use strict';

angular.module('app')
    .controller('rgiNewResourceDialogCtrl', ['$scope', '$route', 'rgiNotifier', 'rgiResourcesMethodSrvc', function (
        $scope,
        $route,
        rgiNotifier,
        rgiResourcesMethodSrvc
    ) {
        $scope.new_resource = {
            order: $scope.$parent.resources.length + 1,
            type: $scope.$parent.resource_type
        };

        $scope.createResource = function () {
            if (!$scope.new_resource.head) {
                rgiNotifier.error('You must supply a title!');
            } else if (!$scope.new_resource.body) {
                rgiNotifier.error('You must supply content!');
            } else {
                rgiResourcesMethodSrvc.createResource($scope.new_resource)
                    .then(function () {
                        rgiNotifier.notify('New resource created!');
                        $scope.closeThisDialog();
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };
    }]);
