'use strict';

angular.module('app')
    .controller('rgiEditIntervieweeDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiIntervieweeMethodSrvc
    ) {
        $scope.current_user = $scope.$root.current_user;
        $scope.new_interviewee_data = $scope.$parent.interviewee;
        $scope.roles = ['government', 'cso', 'industry', 'expert', 'other'];

        $scope.intervieweeSave = function (new_interviewee_data) {
            // TODO fix save notification
            // TODO error check
            rgiIntervieweeMethodSrvc.updateInterviewee(new_interviewee_data).then(function () {
                rgiNotifier.notify('Interviewee has been updated');
                ngDialog.close();
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });