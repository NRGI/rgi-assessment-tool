'use strict';

angular.module('app')
    .controller('rgiResourcesCtrl', function (
        $scope,
        $location,
        rgiHttpResponseProcessorSrvc,
        rgiResourcesSrvc
    ) {
        $scope.resource_type = $location.$$path.replace('/', '');

        if ($scope.resource_type === 'resource') {
            $scope.title = 'Other Resources';
        } else if ($scope.resource_type === 'faq') {
            $scope.title = 'Frequently Asked Questions';
        }

        rgiResourcesSrvc.query({type: $scope.resource_type}, function(resources) {
            $scope.resources = resources;
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load ' +
            ($scope.resource_type === 'faq' ? 'FAQ' : $scope.resource_type) + ' data failure'));
    });
