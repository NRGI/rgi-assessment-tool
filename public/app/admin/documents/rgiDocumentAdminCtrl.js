'use strict';
/*jslint nomen: true unparam: true regexp: true*/
//var angular;

angular.module('app').controller('rgiDocumentAdminCtrl', function ($scope, rgiDocumentSrvc, rgiUserListSrvc) {
    // filtering options
    $scope.sort_options = [
        {value: 'title', text: 'Sort by document title'},
        {value: 'type', text: 'Sort by document type'},
        {value: 'assessments', text: 'Sort by attached assessments'}
    ];
    $scope.sort_order = $scope.sort_options[0].value;

    $scope.documents = [];
    rgiDocumentSrvc.query({}, function (documents) {
        documents.forEach(function (el) {
            el.user_list = [];
            el.users.forEach(function (element) {
                rgiUserListSrvc.get({_id: element}, function (user) {
                    el.user_list.push(user);
                });
            });
            $scope.documents.push(el);
        });
    });
});
