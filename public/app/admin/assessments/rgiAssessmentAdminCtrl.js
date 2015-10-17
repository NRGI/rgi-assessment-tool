angular.module('app').controller('rgiAssessmentAdminCtrl', function (
    $location,
    $routeParams,
    $scope,
    rgiNotifier,
    ngDialog,
    rgiAssessmentSrvc,
    rgiUserListSrvc,
    rgiAssessmentMethodSrvc
) {
    'use strict';
    // filtering options
    $scope.sort_options = [
        {value: 'country', text: 'Sort by Country'},
        {value: 'start_date', text: 'Date started'},
        {value: 'status', text: 'Status'},
        {value: 'year', text: 'Year of assessment'},
        {value: 'version', text: 'Version'}
    ];
    $scope.sort_order = $scope.sort_options[0].value;
    //if ($routeParams.version === undefined) {
    //    rgiAssessmentSrvc.query(function (data) {
    //        // pull assessment list from collection and adds user name to match reviewer id and researcher id
    //        var assessment;
    //        $scope.assessments = [];
    //
    //        data.forEach(function (el) {
    //            assessment = {
    //                assessment_ID: el.assessment_ID,
    //                country: el.country,
    //                edit_control: el.edit_control,
    //                researcher_ID: el.researcher_ID,
    //                reviewer_ID: el.reviewer_ID,
    //                start_date: el.start_date,
    //                version: el.version,
    //                year: el.year,
    //                status: el.status
    //            };
    //            if (el.modified[0] !== undefined) {
    //                assessment.modified = el.modified;
    //                assessment.edited_by = rgiUserListSrvc.get({_id: el.modified[el.modified.length - 1].modified_by});
    //            }
    //
    //            if(assessment.researcher_ID) {
    //                assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
    //            }
    //
    //            if(assessment.reviewer_ID) {
    //                assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
    //            }
    //            $scope.assessments.push(assessment);
    //        });
    //    });
    //} else {
    //    rgiAssessmentSrvc.query({year: $routeParams.version.substr(0, 4), version: $routeParams.version.substr(5)}, function (data) {
    //        // pull assessment list from collection and adds user name to match reviewer id and researcher id
    //        var assessment;
    //        $scope.assessments = [];
    //
    //        data.forEach(function (el) {
    //            assessment = {
    //                assessment_ID: el.assessment_ID,
    //                country: el.country,
    //                researcher_ID: el.researcher_ID,
    //                reviewer_ID: el.reviewer_ID,
    //                start_date: el.start_date,
    //                version: el.version,
    //                year: el.year,
    //                status: el.status
    //            };
    //            if (el.modified[0] !== undefined) {
    //                assessment.modified = el.modified;
    //                assessment.edited_by = rgiUserListSrvc.get({_id: el.modified[el.modified.length - 1].modified_by});
    //            }
    //            if (assessment.reviewer_ID !== undefined) {
    //                assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
    //                assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
    //            }
    //            $scope.assessments.push(assessment);
    //        });
    //    });
    //}


});
