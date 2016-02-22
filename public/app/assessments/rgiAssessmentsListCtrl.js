'use strict';

angular.module('app')
    .controller('rgiAssessmentsListCtrl', function (
        $scope,
        $routeParams,
        rgiDialogFactory,
        rgiAssessmentSrvc,
        rgiAssessmentRolesGuideSrvc,
        rgiUserListSrvc
    ) {
        // filtering options
        $scope.sort_options = [
            {value: 'country', text: 'Sort by Country'},
            {value: 'start_date', text: 'Sort by Date started'},
            {value: 'status', text: 'Sort by Status'}];
        $scope.sort_order = $scope.sort_options[0].value;

        var getUser = function(userId) {
            return rgiUserListSrvc.getCached({_id: userId});
        };

        var getAssessments = function(criteria) {
            rgiAssessmentSrvc.query(criteria, function (assessments) {
                $scope.assessments = [];

                assessments.forEach(function (assessment) {
                    if (assessment.last_modified) {
                        assessment.edited_by = getUser(assessment.last_modified.modified_by);
                    }

                    rgiAssessmentRolesGuideSrvc.list().forEach(function(role) {
                        if(assessment[role + '_ID']) {
                            assessment[role] = getUser(assessment[role + '_ID']);
                        }
                    });

                    $scope.assessments.push(assessment);
                });
            });
        };

        var criteria = {};

        if ($scope.current_user.role === 'supervisor') {
            $scope.sort_options.push({value: 'year', text: 'Sort by Year of assessment'});
            $scope.sort_options.push({value: 'version', text: 'Sort by Version'});

            if ($routeParams.version) {
                criteria = {
                    year: $routeParams.version.substr(0, 4),
                    version: $routeParams.version.substr(5)
                };
            }
        } else {
            criteria[$scope.current_user.role + '_ID'] = $scope.current_user._id;
        }

        getAssessments(criteria);

        $scope.newAssessmentDialog = function () {
            rgiDialogFactory.assessmentNew($scope);
        };
    });
