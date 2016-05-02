'use strict';

angular.module('app')
    .controller('rgiContactTechCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        rgiContactMethodSrvc,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        HUMAN_NAME_PATTERN,
        VERSION_PATTERN
    ) {
        $scope.issue_selection = [
            {name: 'Trouble logging in.', value: 'login'},
            {name: 'Parts of the site are down.', value: 'down'},
            {name: 'Visual components don\'t look correct', value: 'visual'},
            {name: 'Answers don\'t seem to be saving when completed', value: 'save'},
            {name: 'Documents cannot be saved', value: 'upload'},
            {name: 'Cannot edit comments/justification fields', value: 'justification'},
            {name: 'Other', value: 'other'}
        ];

        $scope.clearRequest = function () {
            $scope.request = {tool: 'rgi', issue: $scope.issue_selection[$scope.issue_selection.length - 1]};
        };

        $scope.clearRequest();
        var criteria = {};

        $scope.versionPattern = VERSION_PATTERN;
        $scope.humanNamePattern = HUMAN_NAME_PATTERN;

        $scope.os_selection = [
            {name: 'Android', value: 'android'},
            {name: 'Windows Phone', value: 'windows_ph'},
            {name: 'iOS', value: 'ios'},
            {name: 'Windows 10', value:'win10'},
            {name: 'Windows 8.1', value:'win8.1'},
            {name: 'Windows 8', value: 'win8'},
            {name: 'Windows 7', value: 'win7'},
            {name: 'Windows XP', value: 'winxp'},
            {name: 'OS X El Capitan', value: 'osx10.11'},
            {name: 'OS X Yosemite', value: 'osx10.10'},
            {name: 'OS X Mavericks', value: 'osx10.9'},
            {name: 'OS X Mountain Lion', value: 'osx10.8'},
            {name: 'OS X Lion', value: 'osx10.7'},
            {name: 'OS X Snow Leopard', value: 'osx10.6'},
            {name: 'Ubuntu', value: 'ubuntu'},
            {name: 'Other', value: 'other'}
        ];
        $scope.browser_selection = [
            {name: 'Internet Explorer', value: 'ie'},
            {name: 'Firefox', value: 'firefox'},
            {name: 'Chrome', value: 'chrome'},
            {name: 'Opera', value: 'opera'},
            {name: 'Yandex', value: 'yandex'},
            {name: 'Safari', value: 'safari'},
            {name: 'Other', value: 'other'}
        ];

        if(rgiIdentitySrvc.currentUser) {
            $scope.request.first_name = rgiIdentitySrvc.currentUser.firstName;
            $scope.request.last_name = rgiIdentitySrvc.currentUser.lastName;
            $scope.request.email = rgiIdentitySrvc.currentUser.email;
            var getAssessments = function(criteria) {
                rgiAssessmentSrvc.query(criteria, function (assessments) {
                    if (assessments.length > 1) {
                        assessments.sort(function(assessmentA, assessmentB) {
                            if(assessmentA.country !== assessmentB.country) {
                                return assessmentA.country > assessmentB.country;
                            }

                            if(assessmentA.year !== assessmentB.year) {
                                return assessmentA.year > assessmentB.year;
                            }

                            if(assessmentA.version !== assessmentB.version) {
                                return assessmentA.version > assessmentB.version;
                            }

                            return assessmentA.mineral > assessmentB.mineral;
                        });

                        $scope.assessments = assessments;
                    } else if (assessments.length > 0) {
                        $scope.request.assessment = assessments[0];
                    }

                });
            };
            criteria[rgiIdentitySrvc.currentUser.role + '_ID'] = rgiIdentitySrvc.currentUser._id;
            getAssessments(criteria);
        }

        $scope.sendRequest = function() {
            var contactInfo = $scope.request;
            if (!contactInfo.first_name || !contactInfo.first_name) {
                rgiNotifier.error('You must supply a name!');
            } else if (!contactInfo.email) {
                rgiNotifier.error('You must supply an email!');
            } else if (!contactInfo.issue) {
                rgiNotifier.error('You must select an issue!');
            } else {
                rgiContactMethodSrvc.contact(contactInfo).then(function () {
                    rgiNotifier.notify('Request sent.');
                    $location.path('/');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };
    });
