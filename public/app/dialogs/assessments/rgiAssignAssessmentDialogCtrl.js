'use strict';

angular
    .module('app')
    .controller('rgiAssignAssessmentDialogCtrl', function (
        $scope,
        $location,
        $route,
        ngDialog,
        rgiUtilsSrvc,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiUserSrvc,
        rgiUserMethodSrvc
    ) {
        var original_assessment = {};
        var assessmentRoles = ['researcher', 'reviewer'];
        // get all researchers
        $scope.researchers = rgiUserSrvc.query({role: 'researcher'});
        // get all reviewers
        $scope.reviewers = rgiUserSrvc.query({role: 'reviewer'});


        // get assessment that needs to be updated
        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessment = assessment;
            angular.extend(original_assessment, assessment);

            assessmentRoles.forEach(function(role) {
                if(assessment[role + '_ID']) {
                    rgiUserSrvc.get({_id: assessment[role + '_ID']}, function (user) {
                        $scope[role + '_select'] = user;
                    });
                }
            });
        });


        //// get questions for insertion into answers collection
        //$scope.questions = rgiQuestionSrvc.query({assessments: $scope.$parent.assessment_update_ID.substr(3)});

        $scope.assessmentAssign = function (researcher_select, reviewer_select) {
            if (!researcher_select) {
                rgiNotifier.error('You must select a researcher!');
            } else {
                var new_researcher_data = new rgiUserSrvc(JSON.parse(researcher_select)),
                    new_assessment_data = $scope.assessment;

                new_assessment_data.mail = true;

                new_assessment_data.status = 'trial';
                new_assessment_data.researcher_ID = new_researcher_data._id;
                new_assessment_data.edit_control = new_researcher_data._id;
                new_researcher_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});

                if (reviewer_select) {
                    var new_reviewer_data = new rgiUserSrvc(JSON.parse(reviewer_select));

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

                } else if (!reviewer_select) {
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
            var role_changed = false;

            assessmentRoles.forEach(function(role) {
                if($scope.assessment && (original_assessment[role + '_ID'] !== $scope.assessment[role + '_ID'])) {
                    role_changed = true;
                }
            });

            return role_changed;
        };

        $scope.reassignAssessment = function () {
            if (!$scope.researcher_select) {
                rgiNotifier.error('No researcher data!');
            } else {
                var reassign_data = {},
                    new_assessment_data = $scope.assessment;

                var getUser = function(users, userId) {
                    var found_user = {};

                    users.forEach(function(user) {
                        if(user._id === userId) {
                            found_user = user;
                        }
                    });

                    return found_user;
                };

                assessmentRoles.forEach(function(role) {

                    if(original_assessment[role + '_ID'] !== $scope.assessment[role + '_ID']) {
                        reassign_data[role] = {
                            old: getUser($scope[role + 's'], original_assessment[role + '_ID']),
                            new: getUser($scope[role + 's'], $scope.assessment[role + '_ID'])
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
                console.log(new_assessment_data);

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