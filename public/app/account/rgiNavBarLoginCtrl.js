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
        var setUserData = function() {
            $scope.versions = [];
            $scope.current_user = rgiIdentitySrvc.currentUser;

            if ($scope.current_user && $scope.current_user.isSupervisor()) {
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
            }
        };

        setUserData();

        $scope.recoverPassword = function() {
            $location.path('/recover-password');
        };

        $scope.signin = function (username, password) {
            rgiAuthSrvc.authenticateUser(username, password).then(function (success) {
                if (success) {
                    setUserData();
                    rgiNotifier.notify('You have successfully signed in!');
                    $location.path('/');
                } else {
                    rgiNotifier.error('Username/Password combination incorrect');
                }
            });
        };

        $scope.signout = function () {
            rgiAuthSrvc.logoutUser().then(function () {
                $scope.username = "";
                $scope.password = "";
                rgiNotifier.notify('You have successfully signed out!');
                $location.path('/');
            });
        };
    });
