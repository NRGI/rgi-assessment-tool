'use strict';

angular.module('app')
    .controller('rgiFinalChoiceDialogCtrl', function (
        $scope,
        $location,
        $routeParams,
        $route,
        rgiAnswerSrvc,
        rgiAnswerMethodSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiQuestionSetSrvc,
        rgiUrlGuideSrvc
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
        }, function(response) {
            rgiNotifier.error(rgiHttpResponseProcessorSrvc.getMessage(response, 'Load answer data failure'));
            rgiHttpResponseProcessorSrvc.handle(response);
        });

        var
            getReferenceAuthorId = function(reference) {
                return reference.author._id ? reference.author._id : reference.author;
            },
            isAnyReferenceUploaded = function() {
                var referenceFound = false;

                $scope.answer.references.forEach(function(reference) {
                    if(getReferenceAuthorId(reference) === $scope.current_user._id) {
                        referenceFound = true;
                    }
                });

                return referenceFound;
            },
            getFinalScoreOption = function(text, score, justification, value, role) {
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

        $scope.isOwnAnswerSelected = function() {
            return ($scope.final_choice !== undefined) && ($scope.final_choice.value === 'other');
        };

        $scope.submitExternalChoice = function () {
            if(isAnyReferenceUploaded() || !$scope.isOwnAnswerSelected()) {
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
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    }).finally(function() {
                        $scope.closeThisDialog();
                        $scope.requestProcessing = false;
                    });
            } else {
                rgiNotifier.error('You must add at least one reference for justification');
            }
        };

        $scope.submitFinalChoice = function () {
            var
                answerData = $scope.answer,
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
                        if (rgiQuestionSetSrvc.isAnyQuestionRemaining($scope.current_user.role, true, answerData)) {
                            $location.path( rgiUrlGuideSrvc.getAnswerUrl(answerData.assessment_ID,
                                rgiQuestionSetSrvc.getNextQuestionId($scope.current_user.role, true, answerData)) );
                        } else {
                            $location.path(rgiUrlGuideSrvc.getAssessmentUrl(answerData.assessment_ID));
                        }

                        rgiNotifier.notify('Answer finalized');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    }).finally($scope.closeThisDialog);
            }
        };
    });
