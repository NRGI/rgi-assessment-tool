'use strict';

angular.module('app')
    .controller('rgiMoveAssessmentConfirmationDialogCtrl', ['$scope', '$location', '$route', 'rgiAssessmentMethodSrvc', 'rgiAnswerSrvc', 'rgiAnswerMethodSrvc', 'rgiHttpResponseProcessorSrvc', 'rgiIdentitySrvc', 'rgiNotifier', function (
        $scope,
        $location,
        $route,
        rgiAssessmentMethodSrvc,
        rgiAnswerSrvc,
        rgiAnswerMethodSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        rgiNotifier
    ) {
        $scope.action = $scope.$parent.action;
        $scope.current_user = rgiIdentitySrvc.currentUser;

        switch ($scope.action) {
            case 'researcher_started':
                $scope.action_text = 'send back to researcher to continue assessment';
                break;
            case 'review_researcher':
            case 'review_reviewer':
                $scope.action_text = 'send to ' + $scope.action.split('_')[1] + ' for review';
                break;
            case 'assigned_researcher':
            case 'assigned_reviewer':
            case 'reviewer_trial':
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

        var
            getResolvedHandler = function(message, reloadRoute) {
                return function () {
                    $scope.closeThisDialog();
                    $location.path('/admin/assessment-admin');
                    rgiNotifier.notify(message);

                    if(reloadRoute) {
                        $route.reload();
                    }
                };
            },
            rejectedHandler = function (reason) {
                rgiNotifier.error(reason);
            },
            updateAssessment = function(new_assessment_data, message, reloadRoute) {
                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(getResolvedHandler(message, reloadRoute), rejectedHandler);
            };

        $scope.moveAssessment = function () {
            var new_assessment_data = $scope.$parent.assessment;
            new_assessment_data.status = $scope.action;
            new_assessment_data.mail = true;

            switch ($scope.action) {
                case 'researcher_trial':
                    return updateAssessment(new_assessment_data, 'Assessment returned for review!', true);
                case 'reviewer_trial':
                    new_assessment_data.edit_control = new_assessment_data.reviewer_ID;

                    return rgiAnswerSrvc.query({assessment_ID: $scope.$parent.assessment.assessment_ID}, function (new_answer_data) {
                        if (new_assessment_data.first_pass) {
                            new_answer_data.forEach(function (answer) {
                                if (answer.status !== 'unresolved') {
                                    answer.status = 'assigned';
                                }
                            });

                            new_assessment_data.first_pass = false;
                        }

                        rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                            .then(rgiAnswerMethodSrvc.updateAnswerSet(new_answer_data))
                            .then(getResolvedHandler('Assessment moved forward!', true), rejectedHandler);
                    }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load answer data failure'));
                case 'trial_continue':
                    return updateAssessment(new_assessment_data, 'Assessment returned!', true);
                case 'review_researcher':
                case 'review_reviewer':
                    return updateAssessment(new_assessment_data, 'Assessment moved forward!', true);
                case 'assigned_researcher':
                case 'assigned_reviewer':
                    if ($scope.action === 'assigned_researcher') {
                        new_assessment_data.edit_control = new_assessment_data.researcher_ID;
                    } else if ($scope.action === 'assigned_reviewer') {
                        new_assessment_data.edit_control = new_assessment_data.reviewer_ID;
                    }

                    return updateAssessment(new_assessment_data, 'Assessment moved forward!', true);
                case 'approved':
                    new_assessment_data.status = 'approved';
                    new_assessment_data.edit_control = $scope.current_user._id;
                    return updateAssessment(new_assessment_data, 'Assessment approved!', false);
                case 'internal_review':
                    return rgiNotifier.error('Function "internal_review" does not exist yet!');
                case 'external_review':
                    return rgiNotifier.error('Function "internal_review" does not exist yet!');
                case 'final_approval':
                    return rgiNotifier.error('Function "internal_review" does not exist yet!');
                default:
                    return rgiNotifier.error('`' + $scope.action + '` case does not have a route!');
            }
        };
    }]);
