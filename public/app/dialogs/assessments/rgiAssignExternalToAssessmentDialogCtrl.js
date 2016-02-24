'use strict';

angular.module('app')
    .controller('rgiAssignExternalToAssessmentDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiAssessmentMethodSrvc,
        rgiAssessmentSrvc
    ) {
        var _ = $scope.$parent.$parent._;
        $scope.user = $scope.$parent.user;
        $scope.assessments = rgiAssessmentSrvc.query({ext_reviewer_ID: {$ne: $scope.user._id}});

        $scope.assignAssessmentExternal = function (new_assessment_assignment) {
            var obj, new_user_data = $scope.user,
                new_assessment_data = new_assessment_assignment;
            if(!new_assessment_assignment) {
                rgiNotifier.error('Please select and assessment!');
            } else {
                if (new_assessment_data.ext_reviewer_ID.indexOf($scope.user._id) < 0) {
                    new_assessment_data.ext_reviewer_ID.push($scope.user._id);
                }
                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(function () {
                        rgiNotifier.notify('Assessment assigned!');
                        $scope.closeThisDialog();
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };

    });