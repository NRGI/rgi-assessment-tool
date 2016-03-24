'use strict';

angular.module('app')
    .controller('rgiDocumentTableCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.deleteDocument = function(doc) {
            rgiDialogFactory.deleteDocument($scope, doc);
        };
    });