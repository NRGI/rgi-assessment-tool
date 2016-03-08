'use strict';

angular.module('app')
    .controller('rgiAssignAssessmentSupervisorDialogCtrl', function (
        $scope,
        $location,
        $route,
        $q,
        ngDialog,
        rgiNotifier,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiAssessmentRolesGuideSrvc,
        rgiIdentitySrvc,
        rgiUserSrvc,
        rgiUserMethodSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessment = assessment;

            rgiUserSrvc.query({role: 'supervisor'}, function(users) {
                $scope.availableUsers = users;
            });
        });

        $scope.reviewerAdd = function () {
            $scope.assessment.supervisor_ID.push("");
        };

        $scope.reviewerDelete = function (index) {
            $scope.assessment.supervisor_ID.splice(index, 1);
        };


        var updateAssessment = function(notificationMessage) {
            rgiAssessmentMethodSrvc.updateAssessment($scope.assessment)
                .then(function () {
                    rgiNotifier.notify(notificationMessage);
                    $location.path('/');
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
        };

        $scope.assignAssessmentSupervisor = function () {
            if ($scope.assessment.supervisor_ID.length < 1) {
                rgiNotifier.error('You must select an supervisor!');
            } else {
                var new_assessment = $scope.assessment;

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment)
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
