'use strict';

angular
    .module('app')
    .controller('rgiAssessmentsListTableCtrl', function (
        $scope,
        $location,
        $rootScope,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiDialogFactory,
        rgiAssessmentMethodSrvc
    ) {

        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.externalThreshold = $rootScope.externalThreshold;
        $scope.assessmentsStatistics = $scope.$parent.assessmentsStatistics;

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

        $scope.assessmentTrial = function (assessment) {
            var new_assessment_data = assessment;
            new_assessment_data.status = 'trial_started';
            rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data).then(function () {
                $location.path('/assessments/' + new_assessment_data.assessment_ID);
                rgiNotifier.notify('Assessment trial started!');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.assessmentStart = function (assessment) {
            var new_assessment_data = assessment;
            if ($scope.current_user.isResearcher()) {
                new_assessment_data.status = 'researcher_started';
            } else if ($scope.current_user.isReviewer()) {
                new_assessment_data.status = 'reviewer_started';
            }
            rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data).then(function () {
                $location.path('/assessments/answer/' + new_assessment_data.assessment_ID + '-001');
                rgiNotifier.notify('Assessment started!');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.assignAssessmentDialog = function (assessment) {
            rgiDialogFactory.assessmentAssign($scope, assessment);
        };

        $scope.assignAssessmentExternalDialog = function (assessment) {
            rgiDialogFactory.assessmentExternalAssign($scope, assessment);
        };

        $scope.reassignAssessmentDialog = function (assessment) {
            rgiDialogFactory.assessmentAssign($scope, assessment);
        };
    });