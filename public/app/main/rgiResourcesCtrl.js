angular
    .module('app')
    .controller('rgiResourcesCtrl', function (
        $scope,
        $location,
        rgiIdentitySrvc,
        rgiResourcesSrvc
    ) {
        var resource_type = $location.$$path.replace('/', '');

        if (resource_type === 'resource') {
            $scope.title = 'Other Resources';
        } else if (resource_type === 'faq') {
            $scope.title = 'Frequently Asked Questions'
        }

        $scope.identity = rgiIdentitySrvc;
        $scope.resources = rgiResourcesSrvc.query({type: resource_type});

    });