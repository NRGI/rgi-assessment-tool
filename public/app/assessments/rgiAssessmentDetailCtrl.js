'use strict';

angular.module('app')
    .controller('rgiAssessmentDetailCtrl', function (
        $scope,
        $routeParams,
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
                        $scope.answers[answer.question_ID.precept - 1].data.push(answer);

                        var counters = {
                            complete: ['submitted', 'resubmitted'],
                            approved: ['approved'],
                            flagged: ['flagged'],
                            unresolved: ['unresolved'],
                            finalized: ['final']
                        };

                        for(var counter in counters) {
                            if(counters.hasOwnProperty(counter) && (counters[counter].indexOf(answer.status) !== -1)) {
                                $scope.answers[answer.question_ID.precept - 1][counter]++;
                            }
                        }
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
