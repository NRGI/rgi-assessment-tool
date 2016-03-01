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
            console.log($scope.$parent.assessment_counters);

            if (assessment.status === 'trial_submitted') {
                if ($scope.$parent.assessment_counters.flagged!==0) {
                    workflow_opts.push({
                        text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') for review.',
                        value: control_profile.role + '_trial'
                    });
                } else if ($scope.$parent.assessment_counters.approved===$scope.$parent.assessment_counters.length) {
                    workflow_opts.push({
                        text: 'Allow ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') to continue assessment.',
                        value: 'assigned_' + control_profile.role
                    });
                }
            } else {
                workflow_opts.push({
                    text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') for review.',
                    value: 'review_' + control_profile.role
                });
                if (control_profile.role === 'researcher' && assessment_counters.flagged === 0 && assessment.reviewer_ID) {
                    if (!assessment.first_pass) {
                        workflow_opts.push({
                            text: 'Move to ' + assessment.reviewer_ID.firstName + " " + assessment.reviewer_ID.lastName + ' (' + assessment.reviewer_ID.role + ').',
                            value: assessment.reviewer_ID.role + '_trial'
                        });
                    } else {
                        workflow_opts.push({
                            text: 'Move to ' + assessment.reviewer_ID.firstName + " " + assessment.reviewer_ID.lastName + ' (' + assessment.reviewer_ID.role + ').',
                            value: 'assigned_' + assessment.reviewer_ID.role
                        });
                    }
                } else if (control_profile.role === 'reviewer' && assessment_counters.flagged === 0) {
                    workflow_opts.push({
                        text: 'Move to ' + assessment.researcher_ID.firstName + " " + assessment.researcher_ID.lastName + ' (' + assessment.researcher_ID.role + ').',
                        value: 'assigned_' + assessment.researcher_ID.role
                    });
                }
            }
            //if (assessment.status === 'trial_submitted') {
            //    workflow_opts.push({
            //        text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') to continue assessment.',
            //        value: 'trial_continue'
            //    });
            //}
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
