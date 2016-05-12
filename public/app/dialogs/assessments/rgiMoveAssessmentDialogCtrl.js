'use strict';

angular.module('app')
    .controller('rgiMoveAssessmentDialogCtrl', function (
        $scope,
        rgiUserSrvc,
        rgiDialogFactory
    ) {
        var getUserInfo = function(user) {
            return user.firstName + " " + user.lastName + ' (' + user.role + ')';
        };

        rgiUserSrvc.get({_id: $scope.$parent.assessment.edit_control}, function (control_profile) {
            var workflowOptions = [],
                assessment = $scope.$parent.assessment,
                stats = $scope.$parent.assessment_counters;

            if (assessment.status === 'trial_submitted') {
                if (stats.flagged !== 0) {
                    workflowOptions.push({
                        text: 'Send back to ' + getUserInfo(control_profile) + ' for review.',
                        value: control_profile.role + '_trial'
                    });
                } else if (stats.approved === stats.length) {
                    workflowOptions.push({
                        text: 'Allow ' + getUserInfo(control_profile) + ' to continue assessment.',
                        value: 'assigned_' + control_profile.role
                    });
                }
            } else {
                workflowOptions.push({
                    text: 'Send back to ' + getUserInfo(control_profile) + ' for review.',
                    value: 'review_' + control_profile.role
                });

                if ((control_profile.role === 'researcher') && (stats.flagged === 0) && assessment.reviewer_ID) {
                    if (assessment.first_pass) {
                        workflowOptions.push({
                            text: 'Move to ' + getUserInfo(assessment.reviewer_ID) + '.',
                            value: assessment.reviewer_ID.role + '_trial'
                        });
                    } else {
                        workflowOptions.push({
                            text: 'Move to ' + getUserInfo(assessment.reviewer_ID) + '.',
                            value: 'assigned_' + assessment.reviewer_ID.role
                        });
                    }
                } else if ((control_profile.role === 'reviewer') && (stats.flagged === 0)) {
                    workflowOptions.push({
                        text: 'Move to ' + getUserInfo(assessment.researcher_ID) + '.',
                        value: 'assigned_' + assessment.researcher_ID.role
                    });
                }
            }

            if ((stats.flagged === 0) && (stats.finalized === stats.length) && (assessment.status !== 'approved')) {
                workflowOptions.push({
                    text: 'Approve assessment',
                    value: 'approved'
                });
            }

            if (assessment.status === 'approved') {
                workflowOptions.push({
                    text: 'Move to internal review',
                    value: 'internal_review'
                });
                workflowOptions.push({
                    text: 'Move to external review',
                    value: 'external_review'
                });
                workflowOptions.push({
                    text: 'Final approval',
                    value: 'final_approval'
                });
            }

            $scope.workflow_opts = workflowOptions;
        });

        $scope.moveAssessment = function () {
            rgiDialogFactory.assessmentMoveConfirm($scope);
        };
    });
