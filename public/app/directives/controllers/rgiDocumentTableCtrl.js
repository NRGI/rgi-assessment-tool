'use strict';

angular.module('app')
    .controller('rgiDocumentTableCtrl', function (
        $scope,
        $rootScope,
        rgiDialogFactory,
        rgiDocumentSrvc,
        rgiIdentitySrvc
    ) {
        var limit = 50,
            currentPage = 0,
            totalPages = 0,
            _ = $rootScope._;

        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.busy = false;

        rgiDocumentSrvc.query({skip: currentPage, limit: limit}, function (response) {
            console.log(response);
            $scope.count = response.count;
            $scope.documents = response.data;
            totalPages = Math.ceil(response.count / limit);
            currentPage = currentPage + 1;
        });

        $scope.loadMoreDocs = function() {
            if ($scope.busy) return;
            $scope.busy = true;
            if(currentPage < totalPages) {
                rgiDocumentSrvc.query({skip: currentPage, limit: limit}, function (response) {
                    console.log($scope.documents.length);
                    $scope.documents = _.union($scope.documents, response.data);
                    console.log($scope.documents.length);
                    
                    currentPage = currentPage + 1;
                    $scope.busy = false;
                });
            }
        };

        $scope.deleteDocument = function(doc) {
            rgiDialogFactory.deleteDocument($scope, doc);
        };
    });