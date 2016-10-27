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
                getRecommendedEditControl = function(status) {
                    var editControl;

                    _.without(ASSESSMENT_ROLES_SET, 'ext_reviewer').forEach(function(role) {
                        if((status.indexOf(role) === 0) && (assessment[role + '_ID'] !== undefined)) {
                            editControl = assessment[role + '_ID'];
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
                assessment.edit_control = $scope.edit_control;

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

            $scope.userRoles = _.without(AVAILABLE_ROLES_SET, 'ext_reviewer');
            $scope.edit_control = getRecommendedEditControl($scope.newStatus);

            if($scope.edit_control === undefined) {
                $scope.edit_control = assessment.edit_control;
            }
        }
    ]);
