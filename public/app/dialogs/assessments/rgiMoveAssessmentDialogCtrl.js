'use strict';

angular.module('app')
    .controller('rgiMoveAssessmentDialogCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        ngDialog,
        rgiIdentitySrvc,
        rgiAssessmentMethodSrvc,
        rgiAnswerSrvc,
        rgiUserSrvc,
        rgiDialogFactory
    ) {
        // get current control profile onto scope and use it to populate workflow_opts\
        $scope.current_user = rgiIdentitySrvc.currentUser;
        rgiUserSrvc.get({_id: $scope.$parent.assessment.edit_control}, function (control_profile) {
            var workflow_opts = [],
                assessment = $scope.$parent.assessment,
                assessment_counters = $scope.$parent.assessment_counters;

            if (assessment.status !== 'approved' && assessment.status !== 'trial_submitted') {
                workflow_opts.push({
                    text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') for review.',
                    value: 'review_' + control_profile.role
                });
                if (control_profile.role === 'researcher' && assessment_counters.flagged === 0 && assessment.reviewer_ID) {
                //if (control_profile.role === 'researcher') {
                    rgiUserSrvc.get({_id: assessment.reviewer_ID}, function (new_profile) {
                        workflow_opts.push({
                            text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
                            value: 'assigned_' + new_profile.role
                        });
                    });
                } else if (control_profile.role === 'reviewer' && assessment_counters.flagged === 0) {
                    rgiUserSrvc.get({_id: assessment.researcher_ID}, function (new_profile) {
                        workflow_opts.push({
                            text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
                            value: 'assigned_' + new_profile.role
                        });
                    });
                }
            }
            if (assessment.status === 'trial_submitted') {
                workflow_opts.push({
                    text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') to continue assessment.',
                    value: 'trial_continue'
                });
            }
            if (assessment_counters.flagged===0 && assessment_counters.finalized===assessment_counters.length && assessment.status!=='approved') {
                workflow_opts.push({
                    text: 'Approve assessment',
                    value: 'approved'
                });
            }
            // workflow_opts.push({
            //     text: 'Move to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ').',
            //     value: ''
            // });

            //if (assessment.status === 'approved' || (assessment_counters.flagged===0 && assessment.status==='under_review')) {
            if (assessment.status === 'approved') {
                workflow_opts.push({
                    text: 'Move to internal review',
                    value: 'internal_review'
                });
                workflow_opts.push({
                    text: 'Move to external review',
                    value: 'external_review'
                });
                workflow_opts.push({
                    text: 'Final approval',
                    value: 'final_approval'
                });
            }
            // } else {
            //     workflow_opts.push({
            //         text: 'Move to internal review',
            //         value: ''
            //     });
            //     workflow_opts.push({

            //         text: 'Move to external review',

            //         value: ''
            //     });
            //     workflow_opts.push({
            //         text: 'Final approval',
            //         value: ''
            //     });
            // }
            $scope.workflow_opts = workflow_opts;
        });

        $scope.closeDialog = function () {
            ngDialog.close();
        };

        $scope.assessmentMove = function () {
            rgiDialogFactory.assessmentMoveConfirm($scope);
         };
    });
