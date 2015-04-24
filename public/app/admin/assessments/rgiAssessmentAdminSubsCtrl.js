'use strict';
var angular;
/*jslint nomen: true unparam: true regexp: true*/

angular.module('app').controller('rgiAssessmentAdminSubsCtrl', function ($scope, $routeParams, ngDialog, rgiAssessmentSrvc, rgiUserListSrvc) {
    // filtering options
    $scope.sortOptions = [
        {value: 'country', text: 'Sort by Country'},
        {value: 'start_date', text: 'Date started'},
        {value: 'status', text: 'Status'},
        {value: 'year', text: 'Year of assessment'},
        {value: 'version', text: 'Version'}
    ];
    $scope.sortOrder = $scope.sortOptions[0].value;

    rgiAssessmentSrvc.query({year: $routeParams.version.substr(0, 4), version: $routeParams.version.substr(5)}, function (data) {
        // pull assessment list from collection and adds user name to match reviewer id and researcher id
        var assessment;
        $scope.assessments = [];

        data.forEach(function (el, i) {
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

    // Deploy new assessment
    $scope.newAssessmentDialog = function () {
        $scope.value = true;
        ngDialog.open({
            template: 'partials/admin/assessments/new-assessment-dialog',
            controller: 'assessmentDialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };
});

// Angular capitilaize filter
angular.module('app').filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) :  '';
    };
});