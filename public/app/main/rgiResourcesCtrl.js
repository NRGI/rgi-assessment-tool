angular
    .module('app')
    .controller('rgiResourcesCtrl', function (
        $scope,
        rgiIdentitySrvc,
        rgiResourcesSrvc
    ) {
        $scope.identity = rgiIdentitySrvc;
        $scope.resources = rgiResourcesSrvc.query({type: 'resource'});

    });