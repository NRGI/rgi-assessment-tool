angular.module('app').controller('rgiAssessmentAdminDetailCtrl', function (
    $scope,
    ngDialog,
    rgiNotifier,
    rgiAssessmentSrvc,
    rgiUserListSrvc,
    rgiAnswerSrvc,
    $routeParams
) {
    'use strict';
    // filtering options
    $scope.sort_options = [
        {value: "question_order", text: "Sort by Question Number"},
        {value: "component_id", text: "Sort by Component"},
        {value: "status", text: "Sort by Status"}
    ];
    $scope.sort_order = $scope.sort_options[0].value;

    // pull assessment data and add
    rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment) {
        assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
        if (assessment.researcher_ID) {
            assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
        }
        assessment.assigned_by = rgiUserListSrvc.get({_id: assessment.assignment.assigned_by});
        assessment.edited_by = rgiUserListSrvc.get({_id: assessment.modified[assessment.modified.length - 1].modified_by});
        //assessment.question_list = rgiAnswerSrvc.query({assessment_ID: assessment.assessment_ID});
        assessment.question_list = [];
        rgiAnswerSrvc.query({assessment_ID: assessment.assessment_ID}, function (answers) {
            assessment.counters = {
                answers: answers.length,
                complete: 0,
                flagged: 0,
                submitted: 0,
                approved: 0,
                resubmitted: 0,
                assigned: 0,
                saved: 0
            };
            answers.forEach(function (el) {
                switch (el.status) {
                    case 'flagged':
                        assessment.counters.flagged +=1;
                        assessment.counters.complete +=1;
                        break;
                    case 'submitted':
                        assessment.counters.submitted +=1;
                        assessment.counters.complete +=1;
                        break;
                    case 'approved':
                        assessment.counters.approved +=1;
                        assessment.counters.complete +=1;
                        break;
                    case 'resubmitted':
                        assessment.counters.resubmitted +=1;
                        break;
                    case 'assigned':
                        assessment.counters.assigned +=1;
                        break;
                    case 'saved':
                        assessment.counters.saved +=1;
                        break;
                }
            });
            assessment.question_list = answers;
        });

        $scope.assessment = assessment;

    });

    $scope.moveAssessmentDialog = function () {
        if ($scope.assessment.questions_complete !== $scope.assessment.question_length) {
            rgiNotifier.error('You must approve or flag all questions!');
        } else {
            $scope.value = true;
            ngDialog.open({
                template: 'partials/dialogs/move-assessment-dialog',
                controller: 'rgiMoveAssessmentDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }
    };
});
