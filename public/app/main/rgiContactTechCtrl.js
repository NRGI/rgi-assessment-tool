'use strict';

angular.module('app')
    .controller('rgiContactTechCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        rgiContactMethodSrvc,
        rgiIdentitySrvc,
        rgiAssessmentSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.request = {tool: 'rgi'};
        var criteria = {};

        $scope.issue_selection = [
            {name: 'Trouble logging in.', value: 'login'},
            {name: 'Parts of the site are down.', value: 'down'},
            {name: 'Visual components don\'t look correct', value: 'visual'},
            {name: 'Answers don\'t seem to be saving when completed', value: 'save'},
            {name: 'Documents cannot be saved', value: 'upload'},
            {name: 'Cannot edit comments/justification fields', value: 'justification'},
            //{name: '', value: ''},
            {name: 'Other', value: 'other'}
        ];
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

        if($scope.current_user) {
            $scope.request.first_name = $scope.current_user.firstName;
            $scope.request.last_name = $scope.current_user.lastName;
            $scope.request.email = $scope.current_user.email;
            var getAssessments = function(criteria) {
                rgiAssessmentSrvc.query(criteria, function (assessments) {
                    if (assessments.length > 1) {
                        $scope.assessments = assessments;
                    } else if (assessments.length > 0) {
                        $scope.request.assessment = assessments[0];
                    }

                });
            };
            criteria[$scope.current_user.role + '_ID'] = $scope.current_user._id;
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

        $scope.clearRequest = function () {
            $scope.request = {tool: 'rgi'};
        };
    });