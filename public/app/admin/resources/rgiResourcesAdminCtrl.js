'use strict';

angular.module('app')
    .controller('rgiResourcesAdminCtrl', function (
        $scope,
        $location,
        $route,
        $q,
        _,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiResourcesSrvc,
        rgiResourcesMethodSrvc,
        rgiSortableGuideSrvc
    ) {
        var originalResources = [];
        $scope.resource_type = $location.$$path.replace('/admin/', '').replace('-admin', '');
        $scope.resources = [];

        if ($scope.resource_type === 'resource') {
            $scope.title = 'Other Resources';
        } else if ($scope.resource_type === 'faq') {
            $scope.title = 'Frequently Asked Questions';
        }

        rgiResourcesSrvc.query({type: $scope.resource_type}, function(resources) {
            $scope.resources = resources;
            originalResources = _.map(resources, _.clone);

            $scope.resources.forEach(function(resource) {
                resource.newOrder = resource.order;
            });
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load ' +
            ($scope.resource_type === 'faq' ? 'FAQ' : $scope.resource_type) + ' data failure'));

        $scope.sortableOptions = rgiSortableGuideSrvc.getOptions(function() {
            $scope.resources.forEach(function(resource, index) {
                resource.newOrder = index + 1;
            });
        });

        $scope.reorder = function() {
            var promises = [];

            originalResources.forEach(function(originalResource) {
                $scope.resources.forEach(function(resource) {
                    if((resource._id === originalResource._id) && (resource.order !== resource.newOrder)) {
                        originalResource.order = resource.newOrder;
                        promises.push(rgiResourcesMethodSrvc.updateResource(originalResource).$promise);
                    }
                });
            });

            $q.all(promises).then(function() {
                rgiNotifier.notify('Reorder completed');

                originalResources.forEach(function(originalResource) {
                    $scope.resources.forEach(function(resource) {
                        if(resource._id === originalResource._id) {
                            resource.order = originalResource.order;
                        }
                    });
                });
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Reorder failed'));
        };

        $scope.isOrderChanged = function() {
            var orderChanged = false;

            $scope.resources.forEach(function(resource) {
                if(resource.order !== resource.newOrder) {
                    orderChanged = true;
                }
            });

            return orderChanged;
        };

        $scope.updateResource = function (resource) {
            if (!resource.head) {
                rgiNotifier.error('You must supply a title');
            } else if (!resource.body) {
                rgiNotifier.error('You must supply content');
            } else if (!resource.order) {
                rgiNotifier.error('You must supply the order you want this to appear');
            } else {
                rgiResourcesMethodSrvc.updateResource(resource).then(function () {
                    $route.reload();
                    rgiNotifier.notify('Resource has been updated');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };

        $scope.showCreateResourceDialog = function () {
            rgiDialogFactory.createResource($scope);
        };

        $scope.showConfirmResourceDeletionDialog = function (resource) {
            rgiDialogFactory.deleteResource($scope, resource);
        };
    });
