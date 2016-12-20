'use strict';

angular.module('app')
    .controller('rgiUserAdminDetailCtrl', ['$scope', '$routeParams', 'rgiDialogFactory', 'rgiDocumentSrvc', 'rgiHttpResponseProcessorSrvc', 'rgiNotifier', 'rgiUserSrvc', function (
        $scope,
        $routeParams,
        rgiDialogFactory,
        rgiDocumentSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiUserSrvc
    ) {
        rgiUserSrvc.get({_id: $routeParams.id}, function (user) {
            $scope.user = user;
            $scope.user.document_details = [];

            if(user.documents) {
                rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();

                user.documents.forEach(function (doc_id) {
                    rgiDocumentSrvc.get({_id: doc_id}, function (doc) {
                        $scope.user.document_details.push(doc);
                    }, rgiHttpResponseProcessorSrvc.getNotRepeatedHandler('Load document data failure'));
                });
            }
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load user data failure'));

        $scope.editUserDialog = function () {
            rgiDialogFactory.userEdit($scope);
        };

        $scope.deleteConfirmDialog = function () {
            rgiDialogFactory.userDelete($scope);
        };

        $scope.addToAssessment = function () {
            rgiDialogFactory.assessmentAddReviewer($scope);
        };

        $scope.toggleUserDisabledStatus = function () {
            rgiDialogFactory.toggleUserDisabledStatus($scope);
        };
    }]);
