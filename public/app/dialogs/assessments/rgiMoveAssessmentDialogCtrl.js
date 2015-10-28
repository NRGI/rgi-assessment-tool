angular
    .module('app')
    .controller('rgiMoveAssessmentDialogCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        ngDialog,
        rgiIdentitySrvc,
        rgiAssessmentMethodSrvc,
        rgiAnswerSrvc,
        rgiUserListSrvc,
        rgiDialogFactory
    ) {
        'use strict';
        // get current control profile onto scope and use it to populate workflow_opts
        rgiUserListSrvc.get({_id: $scope.$parent.assessment.edit_control}, function (control_profile) {
            var workflow_opts = [];
            if ($scope.$parent.assessment.status !== 'approved') {
                workflow_opts.push({
                    text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') for review.',
                    value: 'review_' + control_profile.role
                });
                //if (control_profile.role === 'researcher' && $scope.$parent.assessment_counters.flagged === 0) {
                if (control_profile.role === 'researcher') {
                    rgiUserListSrvc.get({_id: $scope.$parent.assessment.reviewer_ID}, function (new_profile) {
                        workflow_opts.push({
                            text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
                            value: 'assigned_' + new_profile.role
                        });
                    });
                } else if (control_profile.role === 'reviewer' && $scope.$parent.assessment.questions_flagged === 0) {
                    rgiUserListSrvc.get({_id: $scope.$parent.assessment.researcher_ID}, function (new_profile) {
                        workflow_opts.push({
                            text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
                            value: 'assigned_' + new_profile.role
                        });
                    });
                }
            }
            if ($scope.$parent.assessment.questions_flagged === 0 && $scope.$parent.assessment.questions_unfinalized === 0 && $scope.$parent.assessment.status !== 'approved') {
                workflow_opts.push({
                    text: 'Approve assessment',
                    value: 'approved'
                });
            }
            // workflow_opts.push({
            //     text: 'Move to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ').',
            //     value: ''
            // });

            if ($scope.$parent.assessment.status === 'approved' || ($scope.$parent.assessment.questions_flagged === 0 && $scope.$parent.assessment.status === 'under_review')) {
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
