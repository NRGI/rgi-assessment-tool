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
        var
            assessmentId = $routeParams.answer_ID.substring(0, $routeParams.answer_ID.length - 4),
            _ = $scope.$parent.$parent.$parent._;

        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.question_criteria = $scope.$parent.question.question_criteria;
        $scope.answer = $scope.$parent.$parent.answer;
        $scope.requestProcessing = false;

        rgiAnswerSrvc.query({assessment_ID: assessmentId}, function (answers) {
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

        $scope.answerOptions = [getFinalScoreOption('Agree with researcher score', $scope.answer.researcher_score,
            $scope.answer.researcher_justification, 'researcher', 'researcher')];

        if ($scope.answer.reviewer_score) {
            $scope.answerOptions.push(getFinalScoreOption('Agree with reviewer score', $scope.answer.reviewer_score,
                $scope.answer.reviewer_justification, 'reviewer', 'reviewer'));
        }

        $scope.answerOptions.push(getFinalScoreOption('Other score', 0, '', 'other', $scope.current_user.role));

        $scope.submitExternalChoice = function () {
            $scope.requestProcessing = true;
            var
                answerData = $scope.answer,
                finalChoice = $scope.final_choice;

            answerData.external_answer.push({
                comment: finalChoice.comment,
                author: $scope.current_user._id
            });

            if (finalChoice.justification) {
                _.last(answerData.external_answer).justification = finalChoice.justification;
            }

            if (finalChoice.score) {
                _.last(answerData.external_answer).score = finalChoice.score;
            }

            rgiAnswerMethodSrvc.updateAnswer(answerData)
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

        $scope.submitFinalChoice = function () {
            var
                answerData = $scope.$parent.answer,
                finalChoice = $scope.final_choice;

            if (!finalChoice) {
                rgiNotifier.error("You must select an action!");
            } else if (!finalChoice.score) {
                rgiNotifier.error("You must select a score!");
            } else if (!finalChoice.justification) {
                rgiNotifier.error("You must provide a justification!");
            } else {
                answerData.status = 'final';
                ['score', 'role', 'justification'].forEach(function(field) {
                    answerData['final_' + field] = finalChoice[field];
                });

                rgiAnswerMethodSrvc.updateAnswer(answerData)
                    .then(function () {
                        var rootUrl = $scope.current_user.isSupervisor() ? '/admin/assessments-admin' : '/assessments';

                        if (rgiQuestionSetSrvc.isAnyQuestionRemaining(answerData)) {
                            $location.path(rootUrl + '/answer/' + answerData.assessment_ID + "-" + rgiQuestionSetSrvc.getNextQuestionId(answerData));
                        } else {
                            $location.path(rootUrl + '/' + answerData.assessment_ID);
                        }

                        rgiNotifier.notify('Answer finalized');
                        ngDialog.close();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };
    });
