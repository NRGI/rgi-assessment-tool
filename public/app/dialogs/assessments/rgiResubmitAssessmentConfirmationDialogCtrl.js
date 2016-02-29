'use strict';

angular.module('app')
    .controller('rgiResubmitAssessmentConfirmationDialogCtrl', function (
        $scope,
        $location,
        $route,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentMethodSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.assessmentResubmit = function () {
            var new_assessment_data = $scope.$parent.assessment;

            new_assessment_data.status = 'resubmitted';
            //MAIL NOTIFICATION
            new_assessment_data.mail = true;

            rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                .then(function () {
                    ngDialog.close();
                    $location.path('/assessments');
                    //$route.reload();
                    rgiNotifier.notify('Assessment submitted!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });