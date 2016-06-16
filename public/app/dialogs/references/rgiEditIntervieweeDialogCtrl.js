'use strict';

angular.module('app')
    .controller('rgiEditIntervieweeDialogCtrl', function (
        $scope,
        $route,
        rgiIntervieweeMethodSrvc,
        rgiNotifier
    ) {
        $scope.new_interviewee_data = $scope.$parent.interviewee;
        $scope.roles = ['government', 'cso', 'industry', 'expert', 'other'];

        $scope.saveInterviewee = function (interviewee) {
            // TODO error check
            rgiIntervieweeMethodSrvc.updateInterviewee(interviewee).then(function () {
                rgiNotifier.notify('Interviewee has been updated');
                $scope.closeThisDialog();
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    });
