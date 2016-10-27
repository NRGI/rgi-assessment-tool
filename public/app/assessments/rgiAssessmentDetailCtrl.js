'use strict';

angular.module('app')
    .controller('rgiAssessmentDetailCtrl', ['$scope', '$routeParams', 'rgiAnswerSrvc', 'rgiAnswerFilterSrvc', 'rgiAssessmentSrvc', 'rgiAssessmentStatisticsGuideSrvc', 'rgiDialogFactory', 'rgiHttpResponseProcessorSrvc', 'rgiIdentitySrvc', 'rgiNotifier', 'rgiPreceptGuideSrvc', 'rgiQuestionSetSrvc', function (
        $scope,
        $routeParams,
        rgiAnswerSrvc,
        rgiAnswerFilterSrvc,
        rgiAssessmentSrvc,
        rgiAssessmentStatisticsGuideSrvc,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiPreceptGuideSrvc,
        rgiQuestionSetSrvc
    ) {
        $scope.sortOptions = [
            {value: "question_order", text: "Sort by Question Number"},
            {value: "component_id", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}
        ];

        $scope.sortOrder = $scope.sortOptions[0].value;
        $scope.order_reverse = rgiIdentitySrvc.currentUser.isSupervisor();
        $scope.assessment_counters = {length: 0};

        rgiQuestionSetSrvc.loadQuestions(function() {
            rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment) {
                var answer_query = {assessment_ID: assessment.assessment_ID};

                if (['researcher_trial', 'reviewer_trial', 'trial_started', 'trial_submitted'].indexOf(assessment.status) > -1) {
                    answer_query.question_trial = true;
                }

                $scope.assessment = assessment;
                $scope.answers = [];

                rgiAnswerSrvc.query(answer_query, function (answers) {
                    rgiQuestionSetSrvc.setAnswers(rgiAnswerFilterSrvc.getAnswers(answers, assessment));

                    rgiAssessmentStatisticsGuideSrvc.getCounterSetTemplate(function(counters) {
                        $scope.assessment_counters = counters;
                        $scope.answers = rgiPreceptGuideSrvc.getAnswerTemplates();

                        answers.forEach(function (answer) {
                            if(rgiQuestionSetSrvc.isAvailable(rgiIdentitySrvc.currentUser.role, answer)) {
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
                }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load answer data failure'));
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load assessment data failure'));
        });

        var submitAssessment = function(counterName, dialogMethod) {
            if ($scope.assessment_counters.approved + $scope.assessment_counters[counterName] < $scope.assessment_counters.length) {
                rgiNotifier.error('Some answers have not been marked complete or approved!');
            } else {
                rgiDialogFactory[dialogMethod]($scope);
            }
        };

        $scope.submitTrialAssessmentDialog = function () {
            if ($scope.assessment_counters.flagged > 0) {
                rgiNotifier.error('You must address all flags!');
            } else {
                submitAssessment('submitted', 'assessmentTrialSubmit');
            }
        };

        $scope.submitAssessmentDialog = function () {
            submitAssessment('submitted', 'assessmentSubmit');
        };

        $scope.resubmitAssessmentDialog = function () {
            submitAssessment('resubmitted', 'assessmentResubmit');
        };

        $scope.moveAssessmentDialog = function () {
            rgiDialogFactory.assessmentMove($scope);
        };

        $scope.deleteAssessmentDialog = function () {
            rgiDialogFactory.deleteAssessment($scope);
        };
    }]);
