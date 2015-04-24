'use strict';
var angular;
/*jslint nomen: true newcap: true unparam: true*/

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}

angular.module('app').controller('rgiFinalChoiceDialogCtrl', function ($scope, $location, rgiNotifier, ngDialog, rgiAssessmentMethodSrvc, rgiAnswerSrvc, rgiUserListSrvc, rgiAssessmentSrvc, rgiAnswerMethodSrvc) {
    $scope.final_choice_set = [
        {
            text: 'Agree with researcher score',
            value: $scope.$parent.answer.researcher_score,
            role: 'researcher'
        },
        {
            text: 'Agree with reviewer score',
            value: $scope.$parent.answer.reviewer_score,
            role: 'researcher'
        },
        {
            text: 'Other score',
            value: 'other',
            role: 'admin'
        }
    ];
    $scope.question_choices = $scope.$parent.question.question_choices;

    $scope.closeDialog = function () {
        ngDialog.close();
    };

    $scope.finalChoiceSubmit = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.$parent.answer;
        new_assessment_data = $scope.$parent.assessment;

        new_answer_data.status = 'final';
        new_answer_data.final_score = +$scope.final_choice.value;
        new_answer_data.final_role = $scope.final_choice.role;
        if ($scope.final_choice.final_justification) {
            new_answer_data.final_justification = 'admin: ' + $scope.final_choice.final_justification;
        } else {
            new_answer_data.final_justification = $scope.final_choice.role + ': ' + $scope.$parent.answer[$scope.final_choice.role + '_justification'];
        }

        new_assessment_data.questions_unfinalized -= 1;

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                if (new_answer_data.questions_unfinalized === 0) {
                    $location.path('/admin/assessment-review/answer-review-edit/' + new_answer_data.assessment_ID + "-" + String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/admin/assessment-review/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer finalized');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });

        ngDialog.close();

    };
});