'use strict';

angular
    .module('app')
    .controller('rgiFinalChoiceDialogCtrl', function (
        $scope,
        $location,
        $routeParams,
        rgiNotifier,
        ngDialog,
        rgiUtilsSrvc,
        rgiAssessmentMethodSrvc,
        rgiAnswerSrvc,
        rgiUserListSrvc,
        rgiAssessmentSrvc,
        rgiAnswerMethodSrvc
    ) {
        var assessment_ID = $routeParams.answer_ID.substring(0, $routeParams.answer_ID.length - 4);

        $scope.final_choice_set = [
            {
                text: 'Agree with researcher score',
                score: $scope.$parent.answer.researcher_score,
                justification: $scope.$parent.answer.researcher_justification,
                value: 'researcher',
                role: 'researcher'
            },
            {
                text: 'Agree with reviewer score',
                score: $scope.$parent.answer.reviewer_score,
                justification: $scope.$parent.answer.reviewer_justification,
                value: 'reviewer',
                role: 'reviewer'
            },
            {
                text: 'Other score',
                score: 0,
                justification: '',
                value: 'other',
                role: 'admin'
            }
        ];
        $scope.question_criteria = $scope.$parent.question.question_criteria;

        rgiAnswerSrvc.query({assessment_ID: assessment_ID}, function (answers) {
            $scope.question_length = answers.length;
        });

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
                        var root_url = $scope.current_user.role === 'supervisor' ? '/admin/assessments-admin' : '/assessments';

                        if (new_answer_data.question_order !== $scope.question_length) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill((new_answer_data.question_order + 1), 3)));
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