'use strict';

angular.module('app')
    .controller('rgiNavBarLoginCtrl', function (
        $scope,
        $route,
        $location,
        rgiAssessmentSrvc,
        rgiAuthSrvc,
        rgiIdentitySrvc,
        rgiNotifier
    ) {
        var loadAssessments = function() {
            var urls = [];

            rgiAssessmentSrvc.query({}, function (assessments) {
                assessments.forEach(function (assessment) {
                    if (urls.indexOf(assessment.year + '_' + assessment.version) < 0) {
                        urls.push(assessment.year + '_' + assessment.version);
                        $scope.versions.push({
                            year: assessment.year,
                            version: assessment.version,
                            name: assessment.year + ' ' + assessment.version.charAt(0).toUpperCase() + assessment.version.slice(1),
                            url: assessment.year + '_' + assessment.version
                        });
                    }
                });
            });
        };

        // assign the identity resource with the current identity using identity service
        $scope.versions = [];

        $scope.current_user = rgiIdentitySrvc.currentUser;

        if ($scope.current_user && $scope.current_user.isSupervisor()) {
            loadAssessments();
        }

        $scope.recoverPassword = function() {
            $location.path('/recover-password');
        };

        // signin function for signin button
        $scope.signin = function (username, password) {
            rgiAuthSrvc.authenticateUser(username, password).then(function (success) {
                $scope.versions = [];

                if (success) {
                    if ($scope.current_user && $scope.current_user.isSupervisor()) {
                        loadAssessments();
                    }

                    rgiNotifier.notify('You have successfully signed in!');
                    $location.path('/');
                } else {
                    rgiNotifier.error('Username/Password combination incorrect');
                }
            });
        };
        // signout function for signout button
        $scope.signout = function () {
            rgiAuthSrvc.logoutUser().then(function () {
                $scope.username = "";
                $scope.password = "";
                rgiNotifier.notify('You have successfully signed out!');
                $location.path('/');
            });
        };
    });
