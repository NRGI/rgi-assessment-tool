'use strict';

angular
    .module('app')
    .controller('rgiUserAdminCtrl', function (
        $scope,
        rgiAssessmentSrvc,
        rgiAuthLogsSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiUserSrvc
    ) {
        $scope.sort_options = [
            {value: "firstName", text: "Sort by First Name"},
            {value: "lastName", text: "Sort by Last Name"},
            {value: "username", text: "Sort by Username"},
            {value: "role", text: "Sort by Role"},
            {value: "approved", text: "Sort by Approved"},
            {value: "submitted", text: "Sort by Submitted"}
        ];

        $scope.sort_order = $scope.sort_options[1].value;
        rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();

        rgiUserSrvc.query({}, function (users) {
            $scope.users = [];

            users.forEach(function (user) {
                rgiAuthLogsSrvc.getMostRecent(user._id, 'sign-in')
                    .then(function (log) {
                        user.last_sign_in = log.data.logs[0];
                    }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Auth logs loading failure'));

                user.assessments.forEach(function(assessment) {
                    rgiAssessmentSrvc.getCached({assessment_ID: assessment.assessment_ID}, function(details) {
                        assessment.details = details;
                    }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load assessment data failure'));
                });

                $scope.users.push(user);
            });
        });
    });
