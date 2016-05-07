'use strict';

angular.module('app')
    .controller('rgiUserAdminDetailCtrl', function (
        $scope,
        $routeParams,
        rgiNotifier,
        rgiUserSrvc,
        rgiDocumentSrvc,
        rgiDialogFactory
    ) {
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

        $scope.addToAssessment = function () {
            rgiDialogFactory.assessmentAddReviewer($scope);
        };
    });
