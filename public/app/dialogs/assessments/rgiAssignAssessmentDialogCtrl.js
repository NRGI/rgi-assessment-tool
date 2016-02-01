'use strict';

angular
    .module('app')
    .controller('rgiAssignAssessmentDialogCtrl', function (
        $scope,
        $location,
        ngDialog,
        rgiUtilsSrvc,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiUserSrvc,
        rgiUserMethodSrvc
    ) {
        var originalAssessment = {};
        var assessmentRoles = ['researcher', 'reviewer'];
        // get all researchers
        $scope.researchers = rgiUserSrvc.query({role: 'researcher'});
        // get all reviewers
        $scope.reviewers = rgiUserSrvc.query({role: 'reviewer'});


        // get assessment that needs to be updated
        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessment = assessment;
            angular.extend(originalAssessment, assessment);

            rgiUserSrvc.get({_id: assessment.researcher_ID}, function (researcher_select) {
                $scope.researcher_select = researcher_select;
            });

            rgiUserSrvc.get({_id: assessment.reviewer_ID}, function (reviewer_select) {
                $scope.reviewer_select = reviewer_select;
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
            var roleCahnged = false;

            assessmentRoles.forEach(function(role) {
                if($scope.assessment && (originalAssessment[role + '_ID'] !== $scope.assessment[role + '_ID'])) {
                    roleCahnged = true;
                }
            });

            return roleCahnged;
        };

        $scope.reassignAssessment = function () {
            if (!$scope.researcher_select) {
                rgiNotifier.error('No researcher data!');
            } else {
                var reassignData = {};

                var getUser = function(users, userId) {
                    var foundUser = {};

                    users.forEach(function(user) {
                        if(user._id === userId) {
                            foundUser = user;
                        }
                    });

                    return foundUser;
                };

                assessmentRoles.forEach(function(role) {
                    if(originalAssessment[role + '_ID'] !== $scope.assessment[role + '_ID']) {
                        reassignData[role] = {
                            old: getUser($scope[role + 's'], originalAssessment[role + '_ID']),
                            new: getUser($scope[role + 's'], $scope.assessment[role + '_ID'])
                        };

                        reassignData[role].old.assessments.push(originalAssessment._id);
                        rgiUserMethodSrvc.updateUser(reassignData[role].old);
                        var assessmentIndex = reassignData[role].old.assessments.indexOf(originalAssessment._id);

                        if(assessmentIndex !== -1) {
                            reassignData[role].old.assessments.splice(assessmentIndex, 1);
                        }

                        rgiUserMethodSrvc.updateUser(reassignData[role].new);
                        originalAssessment[role + '_ID'] = $scope.assessment[role + '_ID'];
                    }
                });

                rgiAssessmentMethodSrvc.updateAssessment($scope.assessment)
                    .then(function () {
                        rgiNotifier.notify('Assessment reassigned!');
                        $scope.closeDialog();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }

        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });