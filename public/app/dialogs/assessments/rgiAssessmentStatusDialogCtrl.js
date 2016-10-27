'use strict';

angular.module('app')
    .controller('rgiAssessmentStatusDialogCtrl', [
        '_',
        '$scope',
        'rgiNotifier',
        'rgiAssessmentMethodSrvc',
        'ASSESSMENT_ROLES_SET',
        'AVAILABLE_ROLES_SET',
        function (
            _,
            $scope,
            rgiNotifier,
            rgiAssessmentMethodSrvc,
            ASSESSMENT_ROLES_SET,
            AVAILABLE_ROLES_SET
        ) {
            var
                assessment = {},
                getAssignedUserByRole = function(role) {
                    return assessment[role + '_ID'];
                },
                getRecommendedEditControl = function(status) {
                    var editControl;

                    _.without(ASSESSMENT_ROLES_SET, 'ext_reviewer').forEach(function(role) {
                        if((status.indexOf(role) === 0) && (getAssignedUserByRole(role) !== undefined)) {
                            editControl = getAssignedUserByRole(role)._id;
                        }
                    });

                    return editControl;
                },
                setStatus = function(status) {
                    assessment.status = status;
                    $scope.statuses[$scope.assessmentId] = status;
                };

            $scope.setStatus = function () {
                var originalState = {status: assessment.status, editControl: assessment.edit_control};
                setStatus($scope.newStatus);
                assessment.edit_control = $scope.XYU.edit_control;

                rgiAssessmentMethodSrvc.updateAssessment(assessment)
                    .then(function () {
                        rgiNotifier.notify('Status changed!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                        setStatus(originalState.status);
                        assessment.edit_control = originalState.editControl;
                    }).finally($scope.closeThisDialog);
            };

            $scope.assessments.forEach(function(availableAssessment) {
                if(availableAssessment._id === $scope.assessmentId) {
                    assessment = availableAssessment;
                }
            });

            $scope.XYU = {edit_control: getRecommendedEditControl($scope.newStatus), assignedUsers: []};

            if($scope.XYU.edit_control === undefined) {
                $scope.XYU.edit_control = assessment.edit_control;
            }

            _.without(AVAILABLE_ROLES_SET, 'ext_reviewer').forEach(function(role) {
                if(getAssignedUserByRole(role) !== undefined) {
                    if(role === 'supervisor') {
                        $scope.XYU.assignedUsers = $scope.XYU.assignedUsers.concat(getAssignedUserByRole(role));
                    } else {
                        $scope.XYU.assignedUsers.push(getAssignedUserByRole(role));
                    }
                }
            });
        }
    ]);
