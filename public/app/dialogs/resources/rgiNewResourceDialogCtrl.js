'use strict';

angular.module('app')
    .controller('rgiNewResourceDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiResourcesMethodSrvc
    ) {
        $scope.current_user = $scope.$root.current_user;
        $scope.editorContentMaxLength = $scope.$root.editorContentMaxLength;
        $scope.taToolbarOptions = $scope.$root.taToolbarOptions;

        $scope.new_resource = {
            order: $scope.$parent.resources.length + 1,
            type: $scope.$parent.resource_type
        };

        $scope.resourceCreate = function () {

            if (!$scope.new_resource.order) {
                rgiNotifier.error('You must supply the order you want the block to appear!');
            } else if (!$scope.new_resource.head) {
                rgiNotifier.error('You must supply a title!');
            } else if (!$scope.new_resource.body) {
                rgiNotifier.error('You must supply content!')
            } else {
                rgiResourcesMethodSrvc.createResource($scope.new_resource)
                    .then(function () {
                        rgiNotifier.notify('New resource created!');
                        ngDialog.close();
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });