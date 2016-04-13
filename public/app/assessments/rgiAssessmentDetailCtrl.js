'use strict';

angular.module('app')
    .controller('rgiAssessmentDetailCtrl', function (
        $scope,
        $routeParams,
        $location,
        ngDialog,
        rgiAnswerSrvc,
        rgiAnswerFilterSrvc,
        rgiAssessmentSrvc,
        rgiAssessmentStatisticsGuideSrvc,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiPreceptGuideSrvc,
        rgiQuestionSetSrvc
    ) {
        // filtering options
        $scope.sortOptions = [
            {value: "question_order", text: "Sort by Question Number"},
            {value: "component_id", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}];
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.sortOrder = $scope.sortOptions[0].value;
        $scope.order_reverse = $scope.current_user.isSupervisor();

        rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment) {
            var answer_query = {assessment_ID: assessment.assessment_ID};

            if (['researcher_trial', 'reviewer_trial', 'trial_started', 'trial_submitted'].indexOf(assessment.status) > -1) {
                answer_query.question_trial = true;
            }

            $scope.assessment = assessment;
            $scope.answers = [];

            rgiAnswerSrvc.query(answer_query, function (answers) {
                rgiQuestionSetSrvc.setAnswers(rgiAnswerFilterSrvc.getAnswers(answers, assessment));
                $scope.assessment_counters = rgiAssessmentStatisticsGuideSrvc.getCounterSetTemplate();
                $scope.answers = rgiPreceptGuideSrvc.getAnswerTemplates();

                answers.forEach(function (answer) {
                    if(rgiQuestionSetSrvc.isAvailable($scope.current_user.role, answer)) {
                        rgiAssessmentStatisticsGuideSrvc.updateCounters(answer, $scope.assessment_counters, $scope.assessment);
                        $scope.answers["precept_" + String(answer.question_ID.precept)].section_len += 1;

                        if (answer.status === 'submitted' || answer.status === 'resubmitted') {
                            $scope.answers["precept_" + String(answer.question_ID.precept)].complete += 1;
                        }
                        if (answer.status === 'approved') {
                            $scope.answers["precept_" + String(answer.question_ID.precept)].approved += 1;
                        }
                        if (answer.status === 'flagged') {
                            $scope.answers["precept_" + String(answer.question_ID.precept)].flagged += 1;
                        }
                        if (answer.status === 'unresolved') {
                            $scope.answers["precept_" + String(answer.question_ID.precept)].unresolved += 1;
                        }
                        if (answer.status === 'final') {
                            $scope.answers["precept_" + String(answer.question_ID.precept)].finalized += 1;
                        }

                        $scope.answers["precept_" + String(answer.question_ID.precept)].data.push(answer);
                    }
                });
            });
        });

        $scope.submitTrialAssessmentDialog = function () {
            if ($scope.assessment_counters.flagged!==0) {
                rgiNotifier.error('You must address all flags!');
            } else if ($scope.assessment_counters.approved + $scope.assessment_counters.submitted !== $scope.assessment_counters.length) {
                rgiNotifier.error('Some answers have not been marked complete or approved!');
            } else {
                rgiDialogFactory.assessmentTrialSubmit($scope);
            }
        };

        $scope.submitAssessmentDialog = function () {
            if ($scope.assessment_counters.approved + $scope.assessment_counters.submitted !== $scope.assessment_counters.length) {
                rgiNotifier.error('Some answers have not been marked complete or approved!');
            } else {
                rgiDialogFactory.assessmentSubmit($scope);
            }
        };

        $scope.resubmitAssessmentDialog = function () {
            if ($scope.assessment_counters.approved + $scope.assessment_counters.resubmitted !== $scope.assessment_counters.length) {
                rgiNotifier.error('Some answers have not been marked complete or approved!');
            } else {
                rgiDialogFactory.assessmentResubmit($scope);
            }
        };

        $scope.moveAssessmentDialog = function () {
            rgiDialogFactory.assessmentMove($scope);
        };
    });
