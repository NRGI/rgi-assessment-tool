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

        var root_url,
            assessment_ID = $routeParams.answer_ID.substring(0, $routeParams.answer_ID.length - 4);

        if ($scope.current_user.role === 'supervisor') {
            root_url = '/admin/assessments-admin';
        } else {
            root_url = '/assessments';
        }

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
        $scope.question_choices = $scope.$parent.question.question_choices;

        rgiAnswerSrvc.query({assessment_ID: assessment_ID}, function (answers) {
            $scope.question_length = answers.length;
        });

        $scope.finalChoiceSubmit = function () {
            var new_answer_data = $scope.$parent.answer;

            new_answer_data.status = 'final';
            new_answer_data.final_score = +$scope.final_choice.score;
            new_answer_data.final_role = $scope.final_choice.role;
            new_answer_data.final_justification = $scope.final_choice.final_justification;

            console.log(new_answer_data);

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                .then(function () {
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

            $scope.closeDialog = function () {
                ngDialog.close();
            };
        };
    });