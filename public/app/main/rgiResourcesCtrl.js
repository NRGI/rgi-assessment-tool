'use strict';

angular.module('app')
    .controller('rgiResourcesCtrl', function (
        $scope,
        $location,
        rgiIdentitySrvc,
        rgiResourcesSrvc
    ) {
        $scope.resource_type = $location.$$path.replace('/', '');

        if ($scope.resource_type === 'resource') {
            $scope.title = 'Other Resources';
        } else if ($scope.resource_type === 'faq') {
            $scope.title = 'Frequently Asked Questions';
        }

        $scope.identity = rgiIdentitySrvc;
        $scope.resources = rgiResourcesSrvc.query({type: $scope.resource_type});

    });