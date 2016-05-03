'use strict';

angular
    .module('app')
    .controller('rgiActiveAnswerButtonsCtrl', function (
        $scope,
        $location,
        $rootScope,
        $routeParams,
        $route,
        rgiAnswerSrvc,
        rgiAnswerFilterSrvc,
        rgiAnswerMethodSrvc,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiQuestionSetSrvc,
        rgiReferenceListSrvc,
        rgiUrlGuideSrvc,
        rgiUtilsSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        var assessment_ID = $routeParams.answer_ID.substring(0, $routeParams.answer_ID.length - 4),
            _ = $scope.$parent.$parent._;

        var deactivateAssessmentWatcher = $rootScope.$watch(function() {
            return $scope.$parent.assessment;
        }, function(assessment) {
            if(assessment !== undefined) {
                rgiAnswerSrvc.query({assessment_ID: assessment_ID}, function (answers) {
                    rgiQuestionSetSrvc.setAnswers(rgiAnswerFilterSrvc.getAnswers(answers, assessment));
                });

                deactivateAssessmentWatcher();
            }
        });

        var isTrialAssessment = function() {
            return ['trial_started', 'trial_submitted'].indexOf($scope.$parent.assessment.status) !== -1;
        };

        var updateAnswer = function(answerData, status, notificationMessage) {
            answerData.status = status;

            rgiAnswerMethodSrvc.updateAnswer(answerData)
                .then(function () {
                    if (status!=='saved'){
                        if (rgiQuestionSetSrvc.isAnyQuestionRemaining($scope.current_user.role, true, answerData) && !isTrialAssessment()) {
                            $location.path( rgiUrlGuideSrvc.getAnswerUrl(answerData.assessment_ID,
                                rgiQuestionSetSrvc.getNextQuestionId($scope.current_user.role, true, answerData)) );
                        } else {
                            $location.path(rgiUrlGuideSrvc.getAssessmentUrl(answerData.assessment_ID));
                        }
                    }
                    rgiNotifier.notify(notificationMessage);
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };

        $scope.answerSave = function () {
            var new_answer_data = $scope.answer,
                flag_check = rgiUtilsSrvc.flagCheck(new_answer_data.flags),
                status = new_answer_data.status;

            if (new_answer_data.new_answer_selection) {
                new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
            }

            if (status!=='flagged' && flag_check) {
                status = 'flagged';
            } else if (status==='flagged' && !flag_check) {
                status = 'saved';
            } else if (status==='assigned') {
                status = 'saved';
            }

            new_answer_data[$scope.current_user.role + '_resolve_flag_required'] = false;
            updateAnswer(new_answer_data, status, 'Answer saved');

            // rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            //     .then(function () {
            //         rgiNotifier.notify('Answer saved');
            //     }, function (reason) {
            //         rgiNotifier.notify(reason);
            //     });
        };
        $scope.answerSubmit = function () {
            // answer.question_ID.dependant
            var new_answer_data = $scope.answer,
                auth_match = _.some($scope.references, function (ref) {
                    return (ref.author._id === $scope.current_user._id && !ref.hidden);
                });

            if (!new_answer_data[$scope.current_user.role + '_score'] && !new_answer_data.new_answer_selection) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification'] && !new_answer_data.question_ID.dependant) {
                rgiNotifier.error('You must provide a justification');
            } else if (rgiReferenceListSrvc.isEmpty(new_answer_data.references, $scope.current_user) && !new_answer_data.question_ID.dependant) {
                rgiNotifier.error('You must provide at least one supporting reference!');
            } else if ($scope.current_user.role === 'reviewer' && (new_answer_data.researcher_score.value !== $scope.question.question_criteria[new_answer_data.new_answer_selection].value) && !auth_match && !new_answer_data.question_ID.dependant) {
                rgiNotifier.error('You must provide at least one supporting reference for disagreements!');
            } else {
                if (new_answer_data.new_answer_selection) {
                    new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
                }
                updateAnswer(new_answer_data, 'submitted', 'Answer submitted');
            }
        };

        $scope.answerResubmit = function () {
            var new_answer_data = $scope.answer;
            new_answer_data[$scope.current_user.role + '_resolve_flag_required'] = false;

            if (!new_answer_data[$scope.current_user.role + '_score'] && new_answer_data.new_answer_selection) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification'] && !new_answer_data.question_ID.dependant) {
                rgiNotifier.error('You must provide a justification');
            } else {
                if (new_answer_data.new_answer_selection) {
                    new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
                }
                updateAnswer(new_answer_data, 'resubmitted', 'Answer resubmitted');
            }
        };

        $scope.answerApprove = function () {
            var new_answer_data = $scope.answer;

            if ((new_answer_data.status !== 'approved') && (rgiUtilsSrvc.flagCheck(new_answer_data.flags) === true)) {
                rgiNotifier.error('You can only approve an answer when all flags have been dealt with!');
            } else {
                updateAnswer(new_answer_data, 'approved', 'Answer approved', $scope.$parent.assessment.status !== 'trial_submitted');
            }
        };
        //TODO fix
        $scope.answerClear = function () {
            $route.reload();
            //$scope.answer = angular.copy($scope.$parent.answer_start);
        };

        $scope.answerReturn = function () {
            $location.path(rgiUrlGuideSrvc.getAssessmentUrl($scope.answer.assessment_ID));
        };

        $scope.answerFlag = function () {
            rgiDialogFactory.flagCreate($scope);
        };

        $scope.externalAnswer = function () {
            rgiDialogFactory.answerExternalChoice($scope);
        };

        $scope.answerUnresolved = function() {
            var new_answer_data = $scope.answer;

            if (rgiUtilsSrvc.flagCheck(new_answer_data.flags) !== true) {
                rgiNotifier.error('Only mark flagged answers as unresolved!');
            } else {
                updateAnswer(new_answer_data, 'unresolved', 'Answer tagged as unresolved');
            }
        };
        // make final choice
        $scope.finalChoiceDialog = function () {
            rgiDialogFactory.answerFinalChoice($scope);
        };
    });
