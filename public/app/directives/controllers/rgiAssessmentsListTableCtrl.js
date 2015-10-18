'use strict';

angular
    .module('app')
    .controller('rgiAssessmentsListTableCtrl', function (
        $scope,
        $location,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.assessmentStartReview = function (assessment_ID) {
            rgiAssessmentSrvc.get({assessment_ID: assessment_ID}, function (new_assessment_data) {
                new_assessment_data.status = 'under_review';
                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data).then(function () {
                    $location.path('/admin/assessments-admin/answer/' + assessment_ID + '-001');
                    rgiNotifier.notify('Assessment review started!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            });
        };

        $scope.assignAssessmentDialog = function (assessment) {
            $scope.value = true;
            $scope.assessment_update_ID = assessment.assessment_ID;
            ngDialog.open({
                template: 'partials/dialogs/assign-assessment-dialog',
                controller: 'rgiAssignAssessmentDialogCtrl',
                className: 'ngdialog-theme-default dialogwidth800',
                scope: $scope
            });
        };
        //TODO fix rgiAssignAssessmentDialogCtrl to reassign
        $scope.reassignAssessmentDialog = function (assessment) {
            $scope.value = true;
            $scope.assessment_update_ID = assessment.assessment_ID;
            ngDialog.open({
                template: 'partials/dialogs/assign-assessment-dialog',
                controller: 'rgiAssignAssessmentDialogCtrl',
                className: 'ngdialog-theme-default dialogwidth800',
                scope: $scope
            });
        };
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