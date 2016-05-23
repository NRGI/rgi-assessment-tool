'use strict';

angular.module('app')
    .controller('rgiMoveAssessmentDialogCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiUserSrvc
    ) {
        var getUserInfo = function(user) {
            return user.firstName + " " + user.lastName + ' (' + user.role + ')';
        };

        rgiUserSrvc.get({_id: $scope.$parent.assessment.edit_control}, function (profile) {
            var workflowOptions = [],
                assessment = $scope.$parent.assessment,
                stats = $scope.$parent.assessment_counters,
                addOption = function(text, value) {
                    workflowOptions.push({text: text, value: value});
                };

            if (assessment.status === 'trial_submitted') {
                if (stats.flagged !== 0) {
                    addOption('Send back to ' + getUserInfo(profile) + ' for review.', profile.role + '_trial');
                } else if (stats.approved === stats.length) {
                    addOption('Allow ' + getUserInfo(profile) + ' to continue assessment.', 'assigned_' + profile.role);
                }
            } else {
                addOption('Send back to ' + getUserInfo(profile) + ' for review.', 'review_' + profile.role);

                if(stats.flagged === 0) {
                    if (profile.role === 'reviewer') {
                        var researcher = assessment.researcher_ID;
                        addOption('Move to ' + getUserInfo(researcher) + '.', 'assigned_' + researcher.role);
                    } else if ((profile.role === 'researcher') && assessment.reviewer_ID) {
                        var reviewer = assessment.reviewer_ID;
                        var status = assessment.first_pass ? reviewer.role + '_trial' : 'assigned_' + reviewer.role;
                        addOption('Move to ' + getUserInfo(reviewer) + '.', status);
                    }
                }
            }

            if (assessment.status === 'approved') {
                addOption('Move to internal review', 'internal_review');
                addOption('Move to external review', 'external_review');
                addOption('Final approval', 'final_approval');
            } else if ((stats.flagged === 0) && (stats.finalized === stats.length)) {
                addOption('Approve assessment', 'approved');
            }

            $scope.workflow_opts = workflowOptions;
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load user data failure'));

        $scope.moveAssessment = function () {
            rgiDialogFactory.assessmentMoveConfirm($scope);
        };
    });
