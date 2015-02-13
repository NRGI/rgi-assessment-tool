/*global angular */
'use strict';

var app = angular.module('app').controller('rgiAssessmentsListCtrl', function ($scope, $location, rgiNotifier, rgiAssessmentSrvc, rgiUserListSrvc, rgiIdentitySrvc, rgiUserMethodSrvc, rgiAssessmentMethodSrvc) {

    // filtering options
    $scope.sortOptions = [
        {value: 'country', text: 'Sort by Country'},
        {value: 'start_date', text: 'Date started'},
        {value: 'status', text: 'Status'}];
    $scope.sortOrder = $scope.sortOptions[0].value;

    var current_user = rgiIdentitySrvc.currentUser,
        current_user_role = current_user.roles[0] + "_ID";

    rgiAssessmentSrvc.query({[current_user_role]: current_user._id},function (data) {
        // pull assessment list from collection and adds user name to match reviewer id and researcher id
        $scope.assessments = [];
        for (var i = data.length - 1; i >= 0; i--) {
            var assessment = data[i];
            assessment.edited_by = rgiUserListSrvc.get({_id:data[i].modified[data[i].modified.length-1].modified_by});
            if (assessment.reviewer_ID != undefined) {
                assessment.reviewer = rgiUserListSrvc.get({_id:assessment.reviewer_ID});
                assessment.researcher = rgiUserListSrvc.get({_id:assessment.researcher_ID});
            };
            
            $scope.assessments.push(assessment);
        };
    });

    $scope.assessmentStart = function (assessment) {

        var newAssessmentData = new rgiAssessmentSrvc(assessment);

        newAssessmentData.status = 'started';
        newAssessmentData.start_date = {started_by: rgiIdentitySrvc.currentUser._id};

        rgiAssessmentMethodSrvc.updateAssessment(newAssessmentData).then(function () {
            rgiNotifier.notify('Assessment started!');
            $location.path('/assessments/assessment-edit/' + newAssessmentData.assessment_ID + '001');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };
});

// Angular capitilaize filter
angular.module('app').filter('capitalize', function () {
    return function (input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) :  '';
    };
});