'use strict';

angular.module('app')
    .controller('rgiNavBarLoginCtrl', ['$scope', '$location', 'rgiAssessmentSrvc', 'rgiAuthSrvc', 'rgiHttpResponseProcessorSrvc', 'rgiIdentitySrvc', 'rgiNotifier', function (
        $scope,
        $location,
        rgiAssessmentSrvc,
        rgiAuthSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        rgiNotifier
    ) {
        var setUserData = function() {
            $scope.versions = [];

            if( rgiIdentitySrvc.currentUser && (rgiIdentitySrvc.currentUser.isSupervisor() || rgiIdentitySrvc.currentUser.isViewer()) ) {
                var urls = [], versions = [], query = {};

                if(rgiIdentitySrvc.currentUser.isViewer()) {
                    query.viewer_ID = rgiIdentitySrvc.currentUser._id;
                }

                rgiAssessmentSrvc.query(query, function (assessments) {
                    assessments.forEach(function (assessment) {
                        if(!assessment.deleted && (urls.indexOf(assessment.year + '_' + assessment.version) < 0)) {
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
                }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load assessment data failure'));
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
                        rgiNotifier.error(rgiAuthSrvc.getError() || 'Username / Password combination is incorrect!');
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
    }]);
