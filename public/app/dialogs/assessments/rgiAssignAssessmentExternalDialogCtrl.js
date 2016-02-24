'use strict';

angular.module('app')
    .controller('rgiAssignAssessmentExternalDialogCtrl', function (
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

            rgiUserSrvc.query({role: 'ext_reviewer'}, function(users) {
                $scope.availableUsers = users;
            });
        });

        $scope.reviewerAdd = function () {
            $scope.assessment.ext_reviewer_ID.push("");
        };

        $scope.reviewerDelete = function (index) {
            $scope.assessment.ext_reviewer_ID.splice(index, 1);
        };


        var updateAssessment = function(notificationMessage) {
            rgiAssessmentMethodSrvc.updateAssessment($scope.assessment)
                .then(function () {
                    rgiNotifier.notify(notificationMessage);
                    $location.path('/');
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };

        $scope.assignAssessmentExternal = function () {
            if ($scope.assessment.ext_reviewer_ID.length < 1) {
                rgiNotifier.error('You must select an external reviewer!');
            } else {
                var new_assessment = $scope.assessment
                //$scope.assessment.mail = true;
                //$scope.assessment.status = 'trial';
                //$scope.assessment.edit_control = $scope.assessment.researcher_ID;

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment)
                    .then(function () {
                        rgiNotifier.notify('Assessment assigned!');
                        $scope.closeThisDialog();
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });

                //var assignUser = function(role, linkedAssessmentData) {
                //    var field = role + '_ID';
                //    var user = new rgiUserSrvc(getUser(role, $scope.assessment[field]));
                //
                //    user.assessments.push(linkedAssessmentData);
                //    $scope.assessment[field] = user._id;
                //
                //    return rgiUserMethodSrvc.updateUser(user).$promise;
                //};
                //
                //var promises = [];
                //$scope.assessmentRoles.forEach(function(role) {
                //    if ($scope.assessment[role + '_ID']) {
                //        promises.push(assignUser(role, {
                //            assessment_ID: $scope.$parent.assessment_update_ID,
                //            country_name: $scope.assessment.country,
                //            year: $scope.assessment.year,
                //            version: $scope.assessment.version
                //        }));
                //    }
                //});
                //
                //$q.all(promises).then(function() {
                //    updateAssessment('Assessment assigned!');
                //});
            }
        };


        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
