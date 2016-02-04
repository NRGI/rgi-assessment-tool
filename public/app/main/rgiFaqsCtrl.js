angular
    .module('app')
    .controller('rgiFaqsCtrl', function (
        $scope,
        rgiIdentitySrvc,
        rgiResourcesSrvc
    ) {
        $scope.identity = rgiIdentitySrvc;
        $scope.resources = rgiResourcesSrvc.query({type: 'faq'});

        //$scope.resources = 'HELLJYEAH'

    });