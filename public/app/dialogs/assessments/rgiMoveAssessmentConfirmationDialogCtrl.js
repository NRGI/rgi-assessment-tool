angular
    .module('app')
    .controller('rgiMoveAssessmentConfirmationDialogCtrl', function (
        $scope,
        $location,
        $route,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentMethodSrvc,
        rgiAnswerSrvc,
        rgiAnswerMethodSrvc
    ) {
        'use strict';
        $scope.action = $scope.$parent.action;
        switch ($scope.action) {
            case 'started':
                $scope.action_text = 'send back to researcher to continue assessment';
                break;
            case 'review_researcher':
            case 'review_reviewer':
                $scope.action_text = 'send to ' + $scope.action.split('_')[1] + ' for review';
                break;
            case 'assigned_researcher':
            case 'assigned_reviewer':
                $scope.action_text = 'reassign to ' + $scope.action.split('_')[1];
                break;
            case 'approved':
                $scope.action_text = 'approve assessment';
                break;
            case 'internal_review':
            case 'external_review':
            case 'final_approval':
                $scope.action_text = $scope.action.replace('_', ' ');
        }
        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.assessmentmove = function () {
            var new_assessment_data = $scope.$parent.assessment;
            new_assessment_data.status = $scope.action;
            //new_assessment_data.first
            //MAIL NOTIFICATION
            new_assessment_data.mail = true;

            switch ($scope.action) {
                case 'trial_continue':
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
                case 'review_researcher':
                case 'review_reviewer':
                    new_assessment_data.first_pass = false;

                    rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                        .then(function () {
                            //$scope.closeThisDialog();
                            //$location.path('/admin/assessment-admin');
                            rgiNotifier.notify('Assessment returned!');
                            //$route.reload();
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                    break;

                case 'assigned_researcher':
                case 'assigned_reviewer':

                    if ($scope.action === 'assigned_researcher') {
                        new_assessment_data.edit_control = new_assessment_data.researcher_ID;
                    } else if ($scope.action === 'assigned_reviewer') {
                        new_assessment_data.edit_control = new_assessment_data.reviewer_ID;
                    }

                    rgiAnswerSrvc.query({assessment_ID: $scope.$parent.assessment.assessment_ID}, function (new_answer_data) {

                        if (new_assessment_data.first_pass) {
                            new_answer_data.forEach(function (answer) {
                                if (answer.status !== 'unresolved') {
                                    answer.status = 'assigned';
                                }
                            });
                        }

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

                case 'approved':
                    new_assessment_data.status = 'approved';
                    new_assessment_data.edit_control = $scope.current_user._id;
                    rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                        .then(function () {
                            $location.path('/admin/assessment-admin');
                            rgiNotifier.notify('Assessment approved!');
                            $scope.closeThisDialog();
                        }, function (reason) {
                            rgiNotifier.error(reason);
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



            }
        };
        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });