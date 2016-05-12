'use strict';

angular.module('app')
    .controller('rgiAssignExternalToAssessmentDialogCtrl', function (
        $scope,
        $route,
        rgiNotifier,
        rgiAssessmentMethodSrvc,
        rgiAssessmentSrvc
    ) {
        $scope.user = $scope.$parent.user;
        $scope.assessments = rgiAssessmentSrvc.query({ext_reviewer_ID: {$ne: $scope.user._id}});

        $scope.assignAssessmentExternal = function (new_assessment_assignment) {
            if(!new_assessment_assignment) {
                rgiNotifier.error('Please select an assessment!');
            } else {
                if (new_assessment_assignment.ext_reviewer_ID.indexOf($scope.user._id) < 0) {
                    new_assessment_assignment.ext_reviewer_ID.push($scope.user._id);
                }

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_assignment)
                    .then(function () {
                        rgiNotifier.notify('Assessment assigned!');
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    }).finally($scope.closeThisDialog);
            }
        };
    });
