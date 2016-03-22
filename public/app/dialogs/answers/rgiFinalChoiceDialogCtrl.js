'use strict';

angular.module('app')
    .controller('rgiFinalChoiceDialogCtrl', function (
        $scope,
        $location,
        $routeParams,
        $route,
        rgiNotifier,
        ngDialog,
        rgiAnswerSrvc,
        rgiAnswerMethodSrvc,
        rgiIdentitySrvc,
        rgiQuestionSetSrvc
    ) {
        var assessment_ID = $routeParams.answer_ID.substring(0, $routeParams.answer_ID.length - 4),
            _ = $scope.$parent.$parent.$parent._;

        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.question_criteria = $scope.$parent.question.question_criteria;
        $scope.answer = $scope.$parent.$parent.answer;
        $scope.requestProcessing = false;

        rgiAnswerSrvc.query({assessment_ID: assessment_ID}, function (answers) {
            rgiQuestionSetSrvc.setAnswers(answers);
        });

        var getFinalScoreOption = function(text, score, justification, value, role) {
            return {
                text: text,
                score: score,
                justification: justification,
                comment: '',
                value: value,
                role: role
            };
        };

        $scope.final_choice_set = [getFinalScoreOption('Agree with researcher score', $scope.answer.researcher_score,
            $scope.answer.researcher_justification, 'researcher', 'researcher')];

        if ($scope.answer.reviewer_score) {
            $scope.final_choice_set.push(getFinalScoreOption('Agree with reviewer score', $scope.answer.reviewer_score,
                $scope.answer.reviewer_justification, 'reviewer', 'reviewer'));
        }

        $scope.final_choice_set.push(getFinalScoreOption('Other score', 0, '', 'other', $scope.current_user.role));

        $scope.externalChoiceSubmit = function () {
            $scope.requestProcessing = true;
            var
                new_answer_data = $scope.answer,
                final_choice = $scope.final_choice;

            new_answer_data.external_answer.push({
                comment: final_choice.comment,
                author: $scope.current_user._id
            });

            if (final_choice.justification) {
                _.last(new_answer_data.external_answer).justification = final_choice.justification;
            }

            if (final_choice.score) {
                _.last(new_answer_data.external_answer).score = final_choice.score;
            }

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                .then(function () {
                    rgiNotifier.notify('Input added');
                    $route.reload();
                    ngDialog.close();
                }, function (reason) {
                    rgiNotifier.error(reason);
                }).finally(function() {
                    $scope.requestProcessing = false;
                });
        };

        $scope.finalChoiceSubmit = function () {
            var new_answer_data = $scope.$parent.answer,
                final_choice = $scope.final_choice;
            if (!final_choice) {
                rgiNotifier.error("You must select an action!");
            } else if (!final_choice.score) {
                rgiNotifier.error("You must select a score!");
            } else if (!final_choice.justification) {
                rgiNotifier.error("You must provide a justification!");
            } else {
                new_answer_data.status = 'final';
                new_answer_data.final_score = final_choice.score;
                new_answer_data.final_role = final_choice.role;
                new_answer_data.final_justification = final_choice.justification;

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(function () {
                        var root_url = $scope.current_user.isSupervisor() ? '/admin/assessments-admin' : '/assessments';

                        if (rgiQuestionSetSrvc.isAnyQuestionRemaining(new_answer_data)) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + rgiQuestionSetSrvc.getNextQuestionId(new_answer_data));
                        } else {
                            $location.path(root_url + '/' + new_answer_data.assessment_ID);
                        }
                        rgiNotifier.notify('Answer finalized');
                        ngDialog.close();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }

            $scope.closeDialog = function () {
                ngDialog.close();
            };
        };
    });