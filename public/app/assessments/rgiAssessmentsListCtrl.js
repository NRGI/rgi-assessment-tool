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
            {value: 'start_date', text: 'Date started'},
            {value: 'status', text: 'Status'}];
        $scope.sort_order = $scope.sort_options[0].value;

        switch ($scope.current_user.role) {
            case 'supervisor':
                $scope.sort_options.push({value: 'year', text: 'Year of assessment'});
                $scope.sort_options.push({value: 'version', text: 'Version'});

                $scope.newAssessmentDialog = function ($scope) {
                    rgiDialogFactory.newAssessment($scope);
                };

                if ($routeParams.version === undefined) {
                    rgiAssessmentSrvc.query(function (data) {
                        // pull assessment list from collection and adds user name to match reviewer id and researcher id
                        var assessment;
                        $scope.assessments = [];

                        data.forEach(function (el) {
                            assessment = {
                                assessment_ID: el.assessment_ID,
                                country: el.country,
                                edit_control: el.edit_control,
                                researcher_ID: el.researcher_ID,
                                reviewer_ID: el.reviewer_ID,
                                start_date: el.start_date,
                                version: el.version,
                                year: el.year,
                                status: el.status
                            };
                            if (el.modified[0] !== undefined) {
                                assessment.modified = el.modified;
                                assessment.edited_by = rgiUserListSrvc.get({_id: el.modified[el.modified.length - 1].modified_by});
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
                    }, function (data) {
                        // pull assessment list from collection and adds user name to match reviewer id and researcher id
                        var assessment;
                        $scope.assessments = [];

                        data.forEach(function (el) {
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
                            if (el.modified[0] !== undefined) {
                                assessment.modified = el.modified;
                                assessment.edited_by = rgiUserListSrvc.get({_id: el.modified[el.modified.length - 1].modified_by});
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
                rgiAssessmentSrvc.query({researcher_ID: $scope.current_user._id}, function (data) {
                    // pull assessment list from collection and adds user name to match reviewer id and researcher id
                    $scope.assessments = [];
                    var i, assessment;
                    for (i = data.length - 1; i >= 0; i -= 1) {
                        assessment = data[i];
                        assessment.edited_by = rgiUserListSrvc.get({_id: data[i].modified[data[i].modified.length - 1].modified_by});
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
                rgiAssessmentSrvc.query({reviewer_ID: $scope.current_user._id}, function (data) {
                    // pull assessment list from collection and adds user name to match reviewer id and researcher id
                    $scope.assessments = [];
                    var i, assessment;
                    for (i = data.length - 1; i >= 0; i -= 1) {
                        assessment = data[i];
                        assessment.edited_by = rgiUserListSrvc.get({_id: data[i].modified[data[i].modified.length - 1].modified_by});
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