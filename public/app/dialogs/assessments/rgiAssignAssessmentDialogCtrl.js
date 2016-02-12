'use strict';

angular
    .module('app')
    .controller('rgiAssignAssessmentDialogCtrl', function (
        $scope,
        $location,
        $route,
        ngDialog,
        rgiNotifier,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiUserSrvc,
        rgiUserMethodSrvc
    ) {
        var originalAssessment = {};
        $scope.assessmentRoles = ['researcher', 'reviewer', 'ext_reviewer'];
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

        $scope.assignAssessment = function () {
            if (!$scope.assessment.researcher_ID) {
                rgiNotifier.error('You must select a researcher!');
            } else {
                var researcher = new rgiUserSrvc(getUser('researcher', $scope.assessment.researcher_ID));

                $scope.assessment.mail = true;
                $scope.assessment.status = 'trial';
                $scope.assessment.researcher_ID = researcher._id;
                $scope.assessment.edit_control = researcher._id;

                var linkedAssessmentData = {
                    assessment_ID: $scope.$parent.assessment_update_ID,
                    country_name: $scope.assessment.country,
                    year: $scope.assessment.year,
                    version: $scope.assessment.version
                };

                researcher.assessments.push(linkedAssessmentData);

                var saveAssessment = function() {
                    rgiUserMethodSrvc.updateUser(researcher)
                        .then(rgiAssessmentMethodSrvc.updateAssessment($scope.assessment))
                        .then(function () {
                            rgiNotifier.notify('Assessment assigned!');
                            $location.path('/');
                            $scope.closeThisDialog();
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                };

                if ($scope.assessment.reviewer_ID) {
                    var reviewer = new rgiUserSrvc(getUser('reviewer', $scope.assessment.reviewer_ID));
                    $scope.assessment.reviewer_ID = reviewer._id;
                    reviewer.assessments.push(linkedAssessmentData);

                    rgiUserMethodSrvc.updateUser(reviewer).then(saveAssessment());
                } else {
                    saveAssessment();
                }
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
                $scope.assessmentRoles.forEach(function(role) {
                    if(originalAssessment[role + '_ID'] !== $scope.assessment[role + '_ID']) {
                        var oldAssignee = getUser(role, originalAssessment[role + '_ID']);
                        var newAssignee = getUser(role, $scope.assessment[role + '_ID']);

                        //remove assessment from the old assignee
                        if (oldAssignee && oldAssignee.assessments) {
                            var assessmentIndex = -1;

                            oldAssignee.assessments.forEach(function(assessment, i) {
                                if ($scope.assessment.assessment_ID === assessment.assessment_ID) {
                                    if (i > -1) {
                                        assessmentIndex = i;
                                    }
                                }
                            });

                            oldAssignee.assessments.splice(assessmentIndex, 1);
                            rgiUserMethodSrvc.updateUser(oldAssignee);
                        }

                        //add assessment to the new assignee
                        newAssignee.assessments.push({
                            assessment_ID: $scope.assessment.assessment_ID,
                            country_name: $scope.assessment.country
                        });
                        rgiUserMethodSrvc.updateUser(newAssignee);

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

                rgiAssessmentMethodSrvc.updateAssessment($scope.assessment)
                    .then(function () {
                        rgiNotifier.notify('Assessment reassigned!');
                        $scope.closeDialog();
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