'use strict';

angular.module('app')
    .controller('rgiNavBarLoginCtrl', function (
        $scope,
        $location,
        rgiAssessmentSrvc,
        rgiAuthSrvc,
        rgiIdentitySrvc,
        rgiNotifier
    ) {
        var setUserData = function() {
            $scope.versions = [];

            if (rgiIdentitySrvc.currentUser && rgiIdentitySrvc.currentUser.isSupervisor()) {
                var urls = [], versions = [];

                rgiAssessmentSrvc.query({}, function (assessments) {
                    assessments.forEach(function (assessment) {
                        if (urls.indexOf(assessment.year + '_' + assessment.version) < 0) {
                            urls.push(assessment.year + '_' + assessment.version);
                            versions.push({
                                year: assessment.year,
                                version: assessment.version,
                                name: assessment.year + ' ' + assessment.version.charAt(0).toUpperCase() + assessment.version.slice(1),
                                url: assessment.year + '_' + assessment.version
                            });
                        }
                    });

                    versions.sort(function(versionA, versionB) {
                        return versionA.url > versionB.url;
                    });

                    $scope.versions = versions;
                });
            }
        };

        setUserData();

        $scope.recoverPassword = function() {
            $location.path('/recover-password');
        };

        $scope.signin = function (username, password) {
            if (!username || !password) {
                rgiNotifier.error('You must supply a Username and Password!');
            } else {
                rgiAuthSrvc.authenticateUser(username, password).then(function (success) {
                    if (success) {
                        setUserData();
                        rgiNotifier.notify('You have successfully signed in!');
                        $location.path('/');
                    } else {
                        rgiNotifier.error('Username/Password combination incorrect!');
                    }
                });
            }
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
