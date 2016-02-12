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
        var assessmentRoles = ['researcher', 'reviewer'];
        $scope.availableUsers = {};

        assessmentRoles.forEach(function(role) {
            $scope.availableUsers[role] = rgiUserSrvc.query({role: role});
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

        $scope.assessmentAssign = function () {
            if (!$scope.assessment.researcher_ID) {
                rgiNotifier.error('You must select a researcher!');
            } else {
                var new_researcher_data = new rgiUserSrvc(JSON.parse(getUser('researcher', $scope.assessment.researcher_ID))),
                    new_assessment_data = $scope.assessment;

                new_assessment_data.mail = true;

                new_assessment_data.status = 'trial';
                new_assessment_data.researcher_ID = new_researcher_data._id;
                new_assessment_data.edit_control = new_researcher_data._id;
                new_researcher_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});

                if ($scope.assessment.reviewer_ID) {
                    var new_reviewer_data = new rgiUserSrvc(JSON.parse(getUser('reviewer', $scope.assessment.reviewer_ID)));

                    new_assessment_data.reviewer_ID = new_reviewer_data._id;
                    new_reviewer_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});

                    rgiUserMethodSrvc.updateUser(new_researcher_data)
                        .then(rgiUserMethodSrvc.updateUser(new_reviewer_data))
                        .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                        .then(function () {
                            rgiNotifier.notify('Assessment assigned!');
                            $location.path('/');
                            //$route.reload();
                            $scope.closeThisDialog();
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });

                } else {
                    rgiUserMethodSrvc.updateUser(new_researcher_data)
                        .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                        .then(function () {
                            rgiNotifier.notify('Assessment assigned!');
                            $location.path('/');
                            //$route.reload();
                            $scope.closeThisDialog();
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                }

            }
        };

        $scope.isAnyAssessmentRoleChanged = function() {
            var roleChanged = false;

            assessmentRoles.forEach(function(role) {
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
                var reassign_data = {},
                    new_assessment_data = $scope.assessment;

                assessmentRoles.forEach(function(role) {

                    if(originalAssessment[role + '_ID'] !== $scope.assessment[role + '_ID']) {
                        reassign_data[role] = {
                            old: getUser(role, originalAssessment[role + '_ID']),
                            new: getUser(role, $scope.assessment[role + '_ID'])
                        };

                        //remove assessment from old
                        if (reassign_data[role].old.assessments) {
                            reassign_data[role].old.assessments.forEach(function(assessment, i) {
                                if (new_assessment_data.assessment_ID === assessment.assessment_ID) {
                                    if (i > -1) {
                                        reassign_data[role].old.assessments.splice(i, 1);
                                    }
                                }
                            });
                            rgiUserMethodSrvc.updateUser(reassign_data[role].old);
                        }

                        //add assessment to new
                        reassign_data[role].new.assessments.push({assessment_ID: new_assessment_data.assessment_ID, country_name: new_assessment_data.country});
                        rgiUserMethodSrvc.updateUser(reassign_data[role].new);

                        //change role id
                        if (reassign_data[role].new._id) {
                            new_assessment_data[role + '_ID'] = reassign_data[role].new._id;
                        }

                        //change control if applicable
                        if (new_assessment_data.edit_control === reassign_data[role].old._id) {
                            new_assessment_data.edit_control = reassign_data[role].new._id;
                        }
                    }
                });

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
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