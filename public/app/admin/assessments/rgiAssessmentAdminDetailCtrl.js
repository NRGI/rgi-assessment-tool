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
    rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (data) {
        data.reviewer = rgiUserListSrvc.get({_id: data.reviewer_ID});
        if (data.researcher_ID) {
            data.researcher = rgiUserListSrvc.get({_id: data.researcher_ID});
        }
        data.assigned_by = rgiUserListSrvc.get({_id: data.assignment.assigned_by});
        data.edited_by = rgiUserListSrvc.get({_id: data.modified[data.modified.length - 1].modified_by});
        data.question_list = rgiAnswerSrvc.query({assessment_ID: data.assessment_ID});

        $scope.assessment = data;

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
