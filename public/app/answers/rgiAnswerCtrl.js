'use strict';

angular.module('app')
    .controller('rgiAnswerCtrl', function (
        $scope,
        $routeParams,
        rgiAnswerSrvc,
        rgiAssessmentSrvc,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc
    ) {
        $scope.page_type = 'answer';
        $scope.isCollapsed = false;

        var originallySubmitted = {},
            processFailureResponse = rgiHttpResponseProcessorSrvc.getDefaultHandler('Load answer data failure');

        rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (answer) {
            $scope.answer = answer;
            $scope.flags = answer.flags;
            $scope.references = answer.references;
            $scope.question = answer.question_ID;

            rgiAssessmentSrvc.get({assessment_ID: answer.assessment_ID}, function(assessment) {
                $scope.assessment = assessment;
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load assessment data failure'));

            originallySubmitted.score = answer[rgiIdentitySrvc.currentUser.role + '_score'];
            originallySubmitted.justification = answer[rgiIdentitySrvc.currentUser.role + '_justification'];

            if (answer[rgiIdentitySrvc.currentUser.role + '_score']) {
                $scope.question.question_criteria.forEach(function (opt, i) {
                    if (i === answer[rgiIdentitySrvc.currentUser.role + '_score'].order - 1) {
                        opt.selected = true;
                        $scope.answer.new_answer_selection = i;
                    } else {
                        opt.selected = false;
                    }
                });
            }

            if (answer.guidance_dialog) {
                rgiDialogFactory.guidanceDialog($scope);
            }
        }, processFailureResponse);

        var resetReference = function() {
            rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (answer) {
                console.log('refresh reference list');
                $scope.references = answer.references;
            }, processFailureResponse);
        };

        var resetAnswer = function() {
            rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (answer) {
                $scope.answer = answer;
                $scope.flags = answer.flags;
            }, processFailureResponse);
        };

        $scope.isChoiceChanged = function() {
            return ($scope.answer !== undefined) && ($scope.answer.new_answer_selection !== undefined) &&
                ( ((originallySubmitted.score === undefined) &&
                ($scope.answer.question_ID.question_criteria[$scope.answer.new_answer_selection] !== undefined)) ||
                (originallySubmitted.score.letter !==
                $scope.answer.question_ID.question_criteria[$scope.answer.new_answer_selection].letter) );
        };

        $scope.isJustificationChanged = function() {
            var justification = $scope.answer ? $scope.answer[rgiIdentitySrvc.currentUser.role + '_justification'] : undefined;
            return (justification !== undefined) && ((justification !== originallySubmitted.justification) ||
                (undefined === originallySubmitted.justification));
        };

        $scope.isResolveFlagRequired = function() {
            return $scope.answer && $scope.answer[rgiIdentitySrvc.currentUser.role + '_resolve_flag_required'];
        };

        resetReference();
        $scope.$on('RESET_REFERENCE_ACTION', resetReference);
        $scope.$on('RESET_ANSWER_ACTION', resetAnswer);
    });
