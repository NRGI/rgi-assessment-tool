'use strict';

angular
    .module('app')
    .controller('rgiAssessmentsUserTableCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentMethodSrvc
    ) {
        $scope.assessmentStart = function (assessment) {
            var new_assessment_data = assessment;

            new_assessment_data.status = 'started';
            new_assessment_data.start_date = {started_by: rgiIdentitySrvc.currentUser._id};

            rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data).then(function () {
                    $location.path('/assessments/answer/' + new_assessment_data.assessment_ID + '-001');
                    rgiNotifier.notify('Assessment started!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            };

            $scope.assessmentResubmit = function () {
                var new_assessment_data = $scope.assessment;

                new_assessment_data.status = 'resubmitted';

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(function () {
                        $location.path('/assessments');
                        rgiNotifier.notify('Assessment submitted!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            };
        });