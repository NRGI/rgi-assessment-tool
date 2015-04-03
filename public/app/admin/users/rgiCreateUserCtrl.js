'use strict';
var angular;
angular.module('app').controller('rgiCreateUserCtrl', function ($scope, $location, rgiNotifier, rgiIdentitySrvc, rgiUserSrvc, rgiUserMethodSrvc) {
    $scope.roleOptions = [
        {value: 'admin', text: 'Administrator'},
        {value: 'supervisor', text: 'Supervisor'},
        {value: 'researcher', text: 'Researcher'},
        {value: 'reviewer', text: 'Reviewer'}
        // {value:'external',text:'External Reviewer (i.e. company, national gov, etc.)'},
        // {value:'',text:''}
    ];

  // fix submit button functionality
    $scope.userCreate = function () {
        var newUserData = {
            firstName: $scope.fname,
            lastName: $scope.lname,
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            // ADD ROLE IN CREATION EVENT
            roles: $scope.roleSelect,
            address: [$scope.address],
            language: [$scope.language]
        };

        rgiUserMethodSrvc.createUser(newUserData).then(function () {
            // rgiMailer.send($scope.email);
            rgiNotifier.notify('User account created!' + $scope.email);
            $location.path('/admin/user-admin');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };
});