'use strict';

angular.module('app')
    .controller('rgiEditIntervieweeDialogCtrl', ['$scope', '$route', 'rgiIntervieweeMethodSrvc', 'rgiNotifier', 'HUMAN_NAME_PATTERN', function (
        $scope,
        $route,
        rgiIntervieweeMethodSrvc,
        rgiNotifier,
        HUMAN_NAME_PATTERN
    ) {
        $scope.new_interviewee_data = $scope.$parent.interviewee;
        $scope.roles = ['government', 'cso', 'industry', 'expert', 'other'];
        $scope.humanNamePattern = HUMAN_NAME_PATTERN;

        $scope.saveInterviewee = function (interviewee) {
            // TODO error check
            rgiIntervieweeMethodSrvc.updateInterviewee(interviewee).then(function () {
                rgiNotifier.notify('Interviewee has been updated');
                $scope.closeThisDialog();
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    }]);
