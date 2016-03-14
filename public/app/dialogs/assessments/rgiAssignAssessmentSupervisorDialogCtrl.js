'use strict';

angular.module('app')
    .controller('rgiAssignAssessmentSupervisorDialogCtrl', function (
        $scope,
        $location,
        $route,
        ngDialog,
        rgiNotifier,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiIdentitySrvc,
        rgiUserSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessment = assessment;

            for(var supervisorIndex in $scope.assessment.supervisor_ID) {
                if($scope.assessment.supervisor_ID.hasOwnProperty(supervisorIndex)) {
                    $scope.assessment.supervisor_ID[supervisorIndex] = $scope.assessment.supervisor_ID[supervisorIndex]._id;
                }
            }

            if($scope.assessment.supervisor_ID.length === 0) {
                $scope.assessment.supervisor_ID.push({});
            }

            rgiUserSrvc.query({role: 'supervisor'}, function(users) {
                $scope.availableUsers = users;
            });
        });

        $scope.addAssignee = function () {
            $scope.assessment.supervisor_ID.push({});
        };

        $scope.removeAssignee = function (index) {
            $scope.assessment.supervisor_ID.splice(index, 1);
        };

        $scope.assignAssessmentSupervisor = function () {
            if ($scope.assessment.supervisor_ID.length < 1) {
                rgiNotifier.error('You must select a supervisor!');
            } else {
                rgiAssessmentMethodSrvc.updateAssessment($scope.assessment)
                    .then(function () {
                        rgiNotifier.notify('Assessment assigned!');
                        $scope.closeThisDialog();
                        $route.reload();
                    }, function (reason) {
                        if (reason) {
                            rgiNotifier.error(reason);
                        } else {
                            rgiNotifier.error('Validation error');
                            $scope.closeThisDialog();
                            $route.reload();
                        }
                    });
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
