'use strict';

angular.module('app')
    .controller('rgiAssignAssessmentMultipleAssigneeDialogCtrl', function (
        $scope,
        $route,
        $q,
        ngDialog,
        rgiNotifier,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiIdentitySrvc,
        rgiUserAssessmentsSrvc,
        rgiUserSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        var
            assigneeField = $scope.userType + '_ID',
            originalAssigneeList = [],
            getArrayDifference = function(original, modified) {
                var difference = [];

                original.forEach(function(item) {
                    if(modified.indexOf(item) === -1) {
                        difference.push(item);
                    }
                });

                return difference;
            },
            getNonEmptyAssigneeList = function() {
                var assigneeList = [];

                if($scope.assessment) {
                    $scope.assessment[assigneeField].forEach(function(assignee) {
                        if(assignee) {
                            assigneeList.push(assignee);
                        }
                    });
                }

                return assigneeList;
            };

        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessment = assessment;

            for(var assigneeId in $scope.assessment[assigneeField]) {
                if($scope.assessment[assigneeField].hasOwnProperty(assigneeId) && $scope.assessment[assigneeField][assigneeId]._id) {
                    $scope.assessment[assigneeField][assigneeId] = $scope.assessment[assigneeField][assigneeId]._id;
                }
            }

            originalAssigneeList = $scope.assessment[assigneeField].slice();

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
            return getNonEmptyAssigneeList().length < 1;
        };

        $scope.saveAssigneeList = function () {
            var promises = [];
            promises.push(rgiAssessmentMethodSrvc.updateAssessment($scope.assessment));

            getArrayDifference(originalAssigneeList, getNonEmptyAssigneeList()).forEach(function(removedAssigneeId) {
                $scope.availableUsers.forEach(function(user) {
                    if((user._id === removedAssigneeId) && user.assessments) {
                        promises.push(rgiUserAssessmentsSrvc.remove(user, $scope.assessment));
                    }
                });
            });

            $q.all(promises)
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
