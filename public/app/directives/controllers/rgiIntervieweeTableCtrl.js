'use strict';

angular.module('app')
    .controller('rgiIntervieweeTableCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.deleteInterviewee = function(interviewee) {
            rgiDialogFactory.deleteInterviewee($scope, interviewee);
        };
    });
