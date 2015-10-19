'use strict';

angular
    .module('app')
    .controller('rgiUserAdminDetailCtrl', function (
        $scope,
        $routeParams,
        $location,
        ngDialog,
        rgiNotifier,
        rgiUserSrvc,
        rgiDocumentSrvc,
        rgiDialogFactory
    ) {
        $scope.role_options = [
            // {value: 'admin', text: 'Administrator'},
            {value: 'supervisor', text: 'Supervisor'},
            {value: 'researcher', text: 'Researcher'},
            {value: 'reviewer', text: 'Reviewer'}
        ];

        rgiUserSrvc.get({_id: $routeParams.id}, function (user) {
            $scope.user = user;
            $scope.user.document_details = [];
            if(user.documents) {
                user.documents.forEach(function (doc_id) {
                    rgiDocumentSrvc.get({_id: doc_id}, function (doc) {
                        $scope.user.document_details.push(doc);
                    });
                });
            }
        });

        $scope.editUserDialog = function () {
            rgiDialogFactory.userEdit($scope);
        };

        $scope.deleteConfirmDialog = function () {
            rgiDialogFactory.userDelete($scope);
        };
    });