'use strict';
var angular;

angular.module('app').controller('rgiContactTechCtrl', function ($scope, $location, rgiNotifier, rgiContactMethodSrvc) {

    $scope.request = {tool: 'rgi'}

    $scope.issue_selection = [
        {name: 'Trouble logging in.', value: 'login'},
        {name: 'Parts of the site are down.', value: 'down'},
        {name: 'Visual components don\'t look correct', value: 'visual'},
        {name: 'Answers don\'t seem to be saving when completed', value: 'save'},
        //{name: '', value: ''},
        //{name: '', value: ''},
        //{name: '', value: ''},
        {name: 'Other', value: 'other'}
    ];
    $scope.os_selection = [
        {name: 'Anderoid', value: 'android'},
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

    $scope.sendRequest = function() {
        var contactInfo = $scope.request;

        rgiContactMethodSrvc.contact(contactInfo).then(function () {
            rgiNotifier.notify('Request sent.');
            $location.path('/');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };

    $scope.clearRequest = function () {
        $scope.request = {tool: 'rgi'}
    };
});
