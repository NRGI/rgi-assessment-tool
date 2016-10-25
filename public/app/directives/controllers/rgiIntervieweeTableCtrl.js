'use strict';

angular.module('app')
    .controller('rgiIntervieweeTableCtrl', ['$scope', 'rgiDialogFactory', 'rgiIdentitySrvc', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.deleteInterviewee = function(interviewee) {
            rgiDialogFactory.deleteInterviewee($scope, interviewee);
        };
    }]);
