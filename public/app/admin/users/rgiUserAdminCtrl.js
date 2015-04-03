'use strict';
var angular;

angular.module('app').controller('rgiUserAdminCtrl', function ($scope, rgiUserSrvc, rgiAssessmentSrvc) {
    // filtering options
    $scope.sortOptions = [
        {value: "firstName", text: "Sort by First Name"},
        {value: "lastName", text: "Sort by Last Name"},
        {value: "username", text: "Sort by Username"},
        {value: "role", text: "Sort by Role"},
        {value: "approved", text: "Sort by Approved"},
        {value: "submitted", text: "Sort by Submitted"}
    ];
    $scope.sortOrder = $scope.sortOptions[1].value;

    rgiUserSrvc.query({}, function (data) {
        $scope.users = [];
        var i, j;
        for (i = data.length - 1; i >= 0; i -= 1) {
            for (j = data[i].assessments.length - 1; j >= 0; j -= 1) {
                data[i].assessments[j].details = rgiAssessmentSrvc.get({assessment_ID: data[i].assessments[j].assessment_id});
            }
            $scope.users.push(data[i]);
        }
    });
});