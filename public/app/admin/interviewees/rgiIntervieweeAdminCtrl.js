angular
    .module('app')
    .controller('rgiIntervieweeAdminCtrl', function (
        $scope,
        rgiIntervieweeSrvc
    ) {
        'use strict';
        // filtering options
        $scope.sortOptions = [
            {value: 'lastName', text: 'Sort by last name'},
            {value: 'firstName', text: 'Sort by first name'},
            {value: 'role', text: 'Sort by interviewee role'},
            {value: 'title', text: 'Sort by interviewee title'},
            {value: 'organization', text: 'Sort by interviewee organization'},
            {value: 'assessments', text: 'Sort by attached assessments'}
        ];
        $scope.sortOrder = $scope.sortOptions[0].value;

        $scope.interviewees = rgiIntervieweeSrvc.query({});
    });