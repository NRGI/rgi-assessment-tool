'use strict';

angular.module('app')
    .controller('rgiDocumentAdminDetailCtrl', function (
        $scope,
        $routeParams,
        rgiDialogFactory,
        rgiDocumentSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiUserSrvc
    ) {
        rgiDocumentSrvc.get({_id: $routeParams.document_ID}, function (document) {
            $scope.user_list = [];
            rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();

            document.users.forEach(function (el) {
                rgiUserSrvc.getCached({_id: el}, function (user) {
                    $scope.user_list.push(user);
                }, rgiHttpResponseProcessorSrvc.getNotRepeatedHandler('Load user list failure'));
            });

            $scope.document = document;
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load document data failure'));

        $scope.editDocumentDialog = function () {
            rgiDialogFactory.documentEdit($scope);
        };
    });
