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
                if ((profile.role === 'researcher') && (stats.flagged === 0) && assessment.reviewer_ID) {
                    var reviewer = assessment.reviewer_ID;

                    if (assessment.first_pass) {
                        addOption('Move to ' + getUserInfo(reviewer) + '.', reviewer.role + '_trial');
                    } else {
                        addOption('Move to ' + getUserInfo(reviewer) + '.', 'assigned_' + reviewer.role);
                    }
                } else if ((profile.role === 'reviewer') && (stats.flagged === 0)) {
                    var researcher = assessment.researcher_ID;
                    addOption('Move to ' + getUserInfo(researcher) + '.', 'assigned_' + researcher.role);
                }
            }

            if ((stats.flagged === 0) && (stats.finalized === stats.length) && (assessment.status !== 'approved')) {
                addOption('Approve assessment', 'approved');
            }

            if (assessment.status === 'approved') {
                addOption('Move to internal review', 'internal_review');
                addOption('Move to external review', 'external_review');
                addOption('Final approval', 'final_approval');
            }

            $scope.workflow_opts = workflowOptions;
        });

        $scope.moveAssessment = function () {
            rgiDialogFactory.assessmentMoveConfirm($scope);
        };
    });
