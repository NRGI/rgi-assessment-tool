'use strict';

angular.module('app')
    .controller('rgiAssessmentDetailCtrl', function (
        $scope,
        $routeParams,
        $location,
        ngDialog,
        rgiAnswerSrvc,
        rgiAssessmentSrvc,
        rgiAssessmentStatisticsGuideSrvc,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiPreceptGuideSrvc,
        rgiUserListSrvc
    ) {
        // filtering options
        $scope.sortOptions = [
            {value: "question_order", text: "Sort by Question Number"},
            {value: "component_id", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}];
        $scope.sortOrder = $scope.sortOptions[0].value;
        $scope.order_reverse = true;

        rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment) {
            var answer_query = {assessment_ID: assessment.assessment_ID};
            if (['trial', 'trial_started', 'trial_submitted'].indexOf(assessment.status) > -1) {
                answer_query.question_trial = true;
            }
            $scope.assessment = assessment;
            $scope.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
            if (assessment.reviewer_ID) {
                $scope.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
            }
            $scope.assigned_by = rgiUserListSrvc.get({_id: assessment.assignment.assigned_by});
            $scope.edited_by = rgiUserListSrvc.get({_id: assessment.last_modified.modified_by});
            $scope.answers = [];
            rgiAnswerSrvc.query(answer_query, function (answers) {
                console.log(answers);
                $scope.assessment_counters = rgiAssessmentStatisticsGuideSrvc.getCounterSetTemplate(answers);

                $scope.answers = rgiPreceptGuideSrvc.getAnswerTemplates();

                answers.forEach(function (answer) {
                    rgiAssessmentStatisticsGuideSrvc.updateCounters(answer, $scope.assessment_counters, $scope.assessment);
                    $scope.answers["precept_" + String(answer.question_ID.precept)].section_len += 1;

                    if (answer.status === 'submitted' || answer.status === 'resubmitted') {
                        $scope.answers["precept_" + String(answer.question_ID.precept)].complete += 1;
                    }

                    $scope.answers["precept_" + String(answer.question_ID.precept)].data.push(answer);
                });
            });
        });
        $scope.submitTrialAssessmentDialog = function () {
            rgiDialogFactory.assessmentTrialSubmit($scope);
        };
        $scope.submitAssessmentDialog = function () {
            rgiDialogFactory.assessmentSubmit($scope);
        };
        $scope.resubmitAssessmentDialog = function () {
            rgiDialogFactory.assessmentResubmit($scope);
        };
        $scope.moveAssessmentDialog = function () {
            rgiDialogFactory.assessmentMove($scope);
        };
    });
