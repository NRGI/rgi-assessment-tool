'use strict';

angular
    .module('app')
    .controller('rgiSubmitAssessmentConfirmationDialogCtrl', function (
        $scope,
        $location,
        $route,
        ngDialog,
        rgiNotifier,
        rgiAssessmentMethodSrvc
    ) {
        $scope.assessmentSubmit = function () {
            var new_assessment_data = $scope.$parent.assessment;

            new_assessment_data.status = 'submitted';
            new_assessment_data.questions_complete = 0;
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