'use strict';
//var angular;
/*jslint nomen: true newcap: true unparam: true*/

angular.module('app').controller('rgiMoveAssessmentConfirmationDialogCtrl', function ($scope, $location, $route, ngDialog, rgiNotifier, rgiIdentitySrvc, rgiAssessmentMethodSrvc, rgiAnswerSrvc, rgiAnswerMethodSrvc) {
    $scope.action = $scope.$parent.action;
    switch ($scope.action) {
        case 'review_researcher':
        case 'review_reviewer':
            $scope.action_text = 'send to ' + $scope.action.split('_')[1] + ' for review';
            break;
        case 'assigned_researcher':
        case 'assigned_reviewer':
            $scope.action_text = 'reassign to ' + $scope.action.split('_')[1];
            break;
        case 'internal_review':
        case 'external_review':
        case 'final_approval':
            $scope.action_text = $scope.action.replace('_', ' ');
    };
    $scope.current_user = rgiIdentitySrvc.currentUser;

    $scope.assessmentmove = function () {
        var new_assessment_data;
        //MAIL NOTIFICATION
        new_assessment_data.mail = true;

        switch ($scope.action) {
            case 'review_researcher':
            case 'review_researcher':
                new_assessment_data = $scope.$parent.assessment;
                new_assessment_data.status = $scope.action;
                new_assessment_data.questions_resubmitted = 0;

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(function () {
                        $scope.closeThisDialog();
                        $location.path('/admin/assessment-admin');
                        rgiNotifier.notify('Assessment returned!');
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
                break;

            case 'assigned_researcher':
            case 'assigned_reviewer':
                new_assessment_data = $scope.$parent.assessment;
                new_assessment_data.status = $scope.action;
                new_assessment_data.questions_complete = 0;

                if ($scope.action === 'assigned_researcher') {
                    new_assessment_data.edit_control = new_assessment_data.researcher_ID;
                } else if ($scope.action == 'assigned_reviewer') {
                    new_assessment_data.edit_control = new_assessment_data.reviewer_ID;
                }

                rgiAnswerSrvc.query({assessment_ID: $scope.$parent.assessment.assessment_ID}, function (new_answer_data) {
                    new_answer_data.forEach(function (el) {
                        el.status = 'assigned';
                    });

                    rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                        .then(rgiAnswerMethodSrvc.updateAnswerSet(new_answer_data))
                        .then(function () {
                            $scope.closeThisDialog();
                            $location.path('/admin/assessment-admin');
                            rgiNotifier.notify('Assessment moved forward!');
                            $route.reload();
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                });
                break;

            case 'internal_review':
                rgiNotifier.error('Function "internal_review" does not exist yet!');
                break;

            case 'external_review':
                rgiNotifier.error('Function "internal_review" does not exist yet!');
                break;

            case 'final_approval':
                rgiNotifier.error('Function "internal_review" does not exist yet!');
                break;
            default:
                rgiNotifier.error('$scope.action case does not have a route!');
                break;



        };
    };
    $scope.closeDialog = function () {
        ngDialog.close();
    };
});
