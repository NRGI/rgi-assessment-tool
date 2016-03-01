'use strict';

angular
    .module('app')
    .controller('rgiActiveAnswerButtonsCtrl', function (
        $scope,
        $location,
        $routeParams,
        $route,
        ngDialog,
        rgiAnswerSrvc,
        rgiAnswerMethodSrvc,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiQuestionSetSrvc,
        rgiUtilsSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        var assessment_ID = $routeParams.answer_ID.substring(0, $routeParams.answer_ID.length - 4),
            rootUrl = $scope.current_user.role === 'supervisor' ? '/admin/assessments-admin' : '/assessments',
            _ = $scope.$parent.$parent._;

        rgiAnswerSrvc.query({assessment_ID: assessment_ID}, function (answers) {
            rgiQuestionSetSrvc.setAnswers(answers);
        });

        var updateAnswer = function(answerData, status, notificationMessage, additionalCondition) {
            answerData.status = status;
            rgiAnswerMethodSrvc.updateAnswer(answerData)
                .then(function () {
                    if ((answerData.question_order !== $scope.question_length) && additionalCondition) {
                        $location.path(rootUrl + '/answer/' + answerData.assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill((answerData.question_order + 1), 3)));
                    } else {
                        $location.path(rootUrl + '/' + answerData.assessment_ID);
                    }
                    rgiNotifier.notify(notificationMessage);
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };

        $scope.answerSave = function () {
            var new_answer_data = $scope.answer,
                flag_check = rgiUtilsSrvc.flagCheck(new_answer_data.flags);
            if (new_answer_data.new_answer_selection) {
                new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
            }

            if (new_answer_data.status!=='flagged' && flag_check) {
                new_answer_data.status = 'flagged';
            } else if (new_answer_data.status==='flagged' && !flag_check) {
                new_answer_data.status = 'saved';
            } else if (new_answer_data.status==='assigned') {
                new_answer_data.status = 'saved';
            }

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                .then(function () {
                    rgiNotifier.notify('Answer saved');
                }, function (reason) {
                    rgiNotifier.notify(reason);
                });
        };

        $scope.answerSubmit = function () {
            var new_answer_data = $scope.answer,
                auth_match = _.some($scope.references, function (ref) {
                    return (ref.author._id === $scope.current_user._id && !ref.hidden);
                });

            if (!new_answer_data[$scope.current_user.role + '_score'] && !new_answer_data.new_answer_selection) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification']) {
                rgiNotifier.error('You must provide a justification');
            } else if (new_answer_data.references.length < 1) {
                rgiNotifier.error('You must provide at least one supporting reference!');
            } else if ($scope.current_user.role === 'reviewer' && (new_answer_data.researcher_score.value !== $scope.question.question_criteria[new_answer_data.new_answer_selection].value) && !auth_match) {
                rgiNotifier.error('You must provide at least one supporting reference for disagreements!');
            } else {
                if (new_answer_data.new_answer_selection) {
                    new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
                }
                updateAnswer(new_answer_data, 'submitted', 'Answer submitted', $scope.$parent.assessment.status !== 'trial_started');
            }
        };

        $scope.answerResubmit = function () {
            var new_answer_data = $scope.answer;

            if (!new_answer_data[$scope.current_user.role + '_score'] && new_answer_data.new_answer_selection) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification']) {
                rgiNotifier.error('You must provide a justification');
            } else {
                if (new_answer_data.new_answer_selection) {
                    new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
                }
                updateAnswer(new_answer_data, 'resubmitted', 'Answer resubmitted', true);
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
            $location.path(rootUrl + '/' + $scope.answer.assessment_ID);
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
                updateAnswer(new_answer_data, 'unresolved', 'Answer tagged as unresolved', true);
            }
        };
        // make final choice
        $scope.finalChoiceDialog = function () {
            rgiDialogFactory.answerFinalChoice($scope);
        };
    });