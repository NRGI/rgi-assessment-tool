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

                $scope.newAssessmentDialog = function () {
                    rgiDialogFactory.assessmentNew($scope);
                };

                if ($routeParams.version === undefined) {
                    rgiAssessmentSrvc.query(function (assessments) {
                        // pull assessment list from collection and adds user name to match reviewer id and researcher id
                        var assessment;
                        $scope.assessments = [];

                        assessments.forEach(function (el) {
                            assessment = el;
                            if (el.modified) {
                                assessment.edited_by = rgiUserListSrvc.get({_id: el.modified.modified_by});
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
                            assessment = el;
                            if (el.modified) {
                                assessment.edited_by = rgiUserListSrvc.get({_id: el.modified.modified_by});
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
                }
                break;
            case 'researcher':
                rgiAssessmentSrvc.query({researcher_ID: $scope.current_user._id}, function (assessments) {
                    // pull assessment list from collection and adds user name to match reviewer id and researcher id
                    var assessment;
                    $scope.assessments = [];

                    assessments.forEach(function (el) {
                        assessment = el;
                        assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                        if (el.modified) {
                            assessment.edited_by = rgiUserListSrvc.get({_id: el.modified.modified_by});
                        }
                        if(assessment.reviewer_ID) {
                            assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                        }
                        $scope.assessments.push(assessment);
                    });
                });
                break;
            case 'reviewer':
                rgiAssessmentSrvc.query({reviewer_ID: $scope.current_user._id}, function (assessments) {
                    // pull assessment list from collection and adds user name to match reviewer id and researcher id
                    var assessment;
                    $scope.assessments = [];

                    assessments.forEach(function (el) {
                        assessment = el;
                        assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                        assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                        if (el.modified) {
                            assessment.edited_by = rgiUserListSrvc.get({_id: el.modified.modified_by});
                        }
                        $scope.assessments.push(assessment);
                    });
                });
                break;
        }
    });