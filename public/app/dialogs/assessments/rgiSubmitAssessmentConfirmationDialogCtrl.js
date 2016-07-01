'use strict';

angular.module('app')
    .controller('rgiSubmitAssessmentConfirmationDialogCtrl', function (
        $scope,
        $location,
        rgiAssessmentMethodSrvc,
        rgiNotifier
    ) {
        $scope.submitAssessment = function () {
            var assessment = $scope.$parent.assessment;
            assessment.status = assessment.status === 'trial_started' ? 'trial_submitted' : 'submitted';
            assessment.mail = true;

            rgiAssessmentMethodSrvc.updateAssessment(assessment)
                .then(function () {
                    $scope.closeThisDialog();
                    $location.path('/assessments');
                    rgiNotifier.notify('Assessment submitted!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };
    });
