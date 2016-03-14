'use strict';

angular.module('app')
    .controller('rgiAssignAssessmentDialogCtrl', function (
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
        rgiUserAssessmentsSrvc,
        rgiUserSrvc,
        rgiUserMethodSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        var originalAssessment = {};
        $scope.assessmentRoles = _.without(rgiAssessmentRolesGuideSrvc.list(),'ext_reviewer');
        $scope.availableUsers = {};

        $scope.assessmentRoles.forEach(function(role) {
            $scope.availableUsers[role] = [];
        });

        rgiUserSrvc.query(function(users) {
            users.forEach(function(user) {
                if($scope.assessmentRoles.indexOf(user.role) !== -1) {
                    $scope.availableUsers[user.role].push(user);
                }
            });
        });

        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessmentRoles.forEach(function(role) {
                var field = role + '_ID';
                assessment[field] = assessment[field] && assessment[field]._id ? assessment[field]._id : assessment[field];
            });

            $scope.assessment = assessment;
            angular.extend(originalAssessment, assessment);
        });

        var getUser = function(role, userId) {
            var foundUser = {};

            $scope.availableUsers[role].forEach(function(user) {
                if(user._id === userId) {
                    foundUser = user;
                }
            });

            return foundUser;
        };

        var updateAssessment = function(notificationMessage) {
            rgiAssessmentMethodSrvc.updateAssessment($scope.assessment)
                .then(function () {
                    rgiNotifier.notify(notificationMessage);
                    $location.path('/');
                    $scope.closeThisDialog();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };

        $scope.assignAssessment = function () {
            if (!$scope.assessment.researcher_ID) {
                rgiNotifier.error('You must select a researcher!');
            } else {
                $scope.assessment.mail = true;
                $scope.assessment.status = 'researcher_trial';
                $scope.assessment.edit_control = $scope.assessment.researcher_ID;

                var assignUser = function(role, linkedAssessmentData) {
                    var field = role + '_ID';
                    var user = new rgiUserSrvc(getUser(role, $scope.assessment[field]));

                    user.assessments.push(linkedAssessmentData);
                    $scope.assessment[field] = user._id;

                    return rgiUserMethodSrvc.updateUser(user).$promise;
                };

                var promises = [];
                $scope.assessmentRoles.forEach(function(role) {
                    if ($scope.assessment[role + '_ID']) {
                        promises.push(assignUser(role, {
                            assessment_ID: $scope.$parent.assessment_update_ID,
                            country_name: $scope.assessment.country,
                            year: $scope.assessment.year,
                            version: $scope.assessment.version
                        }));
                    }
                });

                $q.all(promises).then(function() {
                    updateAssessment('Assessment assigned!');
                });
            }
        };

        $scope.isAnyAssessmentRoleChanged = function() {
            var roleChanged = false;

            $scope.assessmentRoles.forEach(function(role) {
                if($scope.assessment && (originalAssessment[role + '_ID'] !== $scope.assessment[role + '_ID'])) {
                    roleChanged = true;
                }
            });

            return roleChanged;
        };

        $scope.reassignAssessment = function () {
            if (!$scope.assessment.researcher_ID) {
                rgiNotifier.error('No researcher data!');
            } else {
                var promises = [];

                $scope.assessmentRoles.forEach(function(role) {
                    if(originalAssessment[role + '_ID'] !== $scope.assessment[role + '_ID']) {
                        var oldAssignee = getUser(role, originalAssessment[role + '_ID']);
                        var newAssignee = getUser(role, $scope.assessment[role + '_ID']);

                        //remove assessment from the old assignee
                        if (oldAssignee && oldAssignee.assessments) {
                            promises.push(rgiUserAssessmentsSrvc.remove(oldAssignee, $scope.assessment));
                        }

                        //add assessment to the new assignee
                        promises.push(rgiUserAssessmentsSrvc.add(newAssignee, $scope.assessment));

                        //change assignee in the assessment
                        if (newAssignee._id) {
                            $scope.assessment[role + '_ID'] = newAssignee._id;
                        }

                        //change control if applicable
                        if ($scope.assessment.edit_control === oldAssignee._id) {
                            $scope.assessment.edit_control = newAssignee._id;
                        }
                    }
                });

                $q.all(promises).then(function() {
                    updateAssessment('Assessment reassigned!');
                });
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
