'use strict';

angular.module('app')
    .controller('rgiResourcesAdminCtrl', function (
        $scope,
        $route,
        $location,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiResourcesSrvc,
        rgiResourcesMethodSrvc
    ) {
        $scope.resource_type = $location.$$path.replace('/admin/', '').replace('-admin', '');

        if ($scope.resource_type === 'resource') {
            $scope.title = 'Other Resources';
        } else if ($scope.resource_type === 'faq') {
            $scope.title = 'Frequently Asked Questions';
        }

        rgiResourcesSrvc.query({type: $scope.resource_type}, function(resources) {
            $scope.resources = resources;
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load ' +
            ($scope.resource_type === 'faq' ? 'FAQ' : $scope.resource_type) + ' data failure'));

        $scope.resourceUpdate = function (resource) {
            var new_resource_data = resource;
            if (!new_resource_data.head) {
                rgiNotifier.error('You must supply a title');
            } else if (!new_resource_data.body) {
                rgiNotifier.error('You must supply content');
            } else if (!new_resource_data.order) {
                rgiNotifier.error('You must supply the order you want this to appear');
            } else {
                rgiResourcesMethodSrvc.updateResource(new_resource_data).then(function () {
                    $route.reload();
                    rgiNotifier.notify('Resource has been updated');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };

        $scope.newResourceDialog = function () {
            rgiDialogFactory.resourcenNew($scope);
        };

        $scope.deleteConfirmDialog = function (resource) {
            rgiDialogFactory.resourceDelete($scope, resource);
        };
    });
