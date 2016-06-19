'use strict';

angular.module('app')
    .controller('rgiResubmitAssessmentConfirmationDialogCtrl', function (
        $scope,
        $location,
        rgiAssessmentMethodSrvc,
        rgiNotifier
    ) {
        $scope.resubmitAssessment = function () {
            $scope.$parent.assessment.status = 'resubmitted';
            $scope.$parent.assessment.mail = true;

            rgiAssessmentMethodSrvc.updateAssessment($scope.$parent.assessment)
                .then(function () {
                    $scope.closeThisDialog();
                    $location.path('/assessments');
                    rgiNotifier.notify('Assessment submitted!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };
    });
