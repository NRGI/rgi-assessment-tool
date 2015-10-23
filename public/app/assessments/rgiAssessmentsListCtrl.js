angular
    .module('app')
    .controller('rgiAssessmentsListCtrl', function (
        $scope,
        $location,
        $routeParams,
        rgiDialogFactory,
        ngDialog,
        rgiNotifier,
        rgiAssessmentSrvc,
        rgiUserListSrvc,
        rgiIdentitySrvc,
        rgiAssessmentMethodSrvc
    ) {
        'use strict';

        // filtering options
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.sort_options = [
            {value: 'country', text: 'Sort by Country'},
            {value: 'start_date', text: 'Sort by Date started'},
            {value: 'status', text: 'Sort by Status'}];
        $scope.sort_order = $scope.sort_options[0].value;

        switch ($scope.current_user.role) {
            case 'supervisor':
                $scope.sort_options.push({value: 'year', text: 'Sort by Year of assessment'});
                $scope.sort_options.push({value: 'version', text: 'Sort by Version'});

                $scope.newAssessmentDialog = function () {
                    rgiDialogFactory.assessmentNew($scope);
                };

                if (!$routeParams.version) {
                    rgiAssessmentSrvc.query({}, function (assessments) {
                        // pull assessment list from collection and adds user name to match reviewer id and researcher id
                        var assessment;
                        $scope.assessments = [];

                        assessments.forEach(function (el) {
                            console.log(el);
                            assessment = {
                                assessment_ID: el.assessment_ID,
                                country: el.country,
                                edit_control: el.edit_control,
                                researcher_ID: el.researcher_ID,
                                reviewer_ID: el.reviewer_ID,
                                start_date: el.start_date,
                                version: el.version,
                                year: el.year,
                                status: el.status,
                                assignment: el.assignment,
                                assignment: el.assignment,
                                assignment: el.assignment,
                                last_modified: el.last_modified
                            };
                            if(el.last_modified) {
                                assessment.edited_by = rgiUserListSrvc.get({_id: el.last_modified.modified_by});
                            }

                            if(assessment.researcher_ID) {
                                assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                            }
                            if(assessment.reviewer_ID) {
                                assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                            }
                            $scope.assessments.push(assessment);
                        });
                    });
                } else {
                    rgiAssessmentSrvc.query({
                        year: $routeParams.version.substr(0, 4),
                        version: $routeParams.version.substr(5)
                    }, function (assessments) {
                        // pull assessment list from collection and adds user name to match reviewer id and researcher id
                        var assessment;
                        $scope.assessments = [];

                        assessments.forEach(function (el) {
                            assessment = {
                                assessment_ID: el.assessment_ID,
                                country: el.country,
                                researcher_ID: el.researcher_ID,
                                reviewer_ID: el.reviewer_ID,
                                start_date: el.start_date,
                                version: el.version,
                                year: el.year,
                                status: el.status
                            };
                            if (el.last_modified) {
                                assessment.last_modified = el.last_modified;
                                assessment.edited_by = rgiUserListSrvc.get({_id: el.last_modified.modified_by});
                            }
                            if (assessment.reviewer_ID !== undefined) {
                                assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                                assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                            }
                            $scope.assessments.push(assessment);
                        });
                    });
                }
                break;
            case 'researcher':
                rgiAssessmentSrvc.query({researcher_ID: $scope.current_user._id}, function (assessments) {
                    // pull assessment list from collection and adds user name to match reviewer id and researcher id
                    $scope.assessments = [];
                    var i, assessment;
                    for (i = assessments.length - 1; i >= 0; i -= 1) {
                        assessment = assessments[i];
                        assessment.edited_by = rgiUserListSrvc.get({_id: assessments[i].last_modified.modified_by});
                        if (assessment.reviewer_ID) {
                            assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                            assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                        } else {
                            assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                        }
                        $scope.assessments.push(assessment);
                    }
                });
                break;
            case 'reviewer':
                rgiAssessmentSrvc.query({reviewer_ID: $scope.current_user._id}, function (assessments) {
                    // pull assessment list from collection and adds user name to match reviewer id and researcher id
                    $scope.assessments = [];
                    var i, assessment;
                    for (i = assessments.length - 1; i >= 0; i -= 1) {
                        assessment = assessments[i];
                        assessment.edited_by = rgiUserListSrvc.get({_id: assessments[i].last_modified.modified_by});
                        if (assessment.reviewer_ID) {
                            assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                            assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                        }
                        $scope.assessments.push(assessment);
                    }
                });
                break;
        }
    });