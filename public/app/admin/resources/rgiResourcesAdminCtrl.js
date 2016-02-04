'use strict'
angular
    .module('app')
    .controller('rgiResourcesAdminCtrl', function (
        $scope,
        $location,
        rgiResourcesSrvc
    ) {
        var resource_type = $location.$$path.replace('/admin/', '').replace('-admin', '');
        if (resource_type === 'resource') {
            $scope.title = 'Other Resources';
        } else if (resource_type === 'faq') {
            $scope.title = 'Frequently Asked Questions'
        }
        $scope.resources = rgiResourcesSrvc.query({type: resource_type});
        $scope.location = $location;
        console.log(resource_type);
    });