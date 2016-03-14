'use strict';

angular.module('app')
    .controller('rgiAssignAssessmentMultipleAssigneeDialogCtrl', function (
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
        var assigneeField = $scope.userType + '_ID';

        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessment = assessment;

            for(var assigneeId in $scope.assessment[assigneeField]) {
                if($scope.assessment[assigneeField].hasOwnProperty(assigneeId)) {
                    $scope.assessment[assigneeField][assigneeId] = $scope.assessment[assigneeField][assigneeId]._id;
                }
            }

            if($scope.assessment[assigneeField].length === 0) {
                $scope.addAssignee();
            }

            rgiUserSrvc.query({role: $scope.userType}, function(users) {
                $scope.availableUsers = users;
            });
        });

        $scope.addAssignee = function () {
            $scope.assessment[assigneeField].push(undefined);
        };

        $scope.removeAssignee = function (index) {
            $scope.assessment[assigneeField].splice(index, 1);
        };

        $scope.isAssigneeListEmpty = function() {
            var assigneeNumber = 0;

            if($scope.assessment) {
                $scope.assessment[assigneeField].forEach(function(assignee) {
                    if(assignee) {
                        assigneeNumber++;
                    }
                });
            }

            return assigneeNumber < 1;
        };

        $scope.saveAssigneeList = function () {
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
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
