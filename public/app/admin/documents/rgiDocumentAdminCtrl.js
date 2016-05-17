'use strict';

angular.module('app')
    .controller('rgiDocumentAdminCtrl', function (
        $scope,
        rgiDocumentSrvc,
        rgiUserListSrvc
    ) {
        // filtering options
        $scope.sort_options = [
            {value: 'title', text: 'Sort by document title'},
            {value: 'type', text: 'Sort by document type'},
            {value: 'assessments', text: 'Sort by attached assessments'}
        ];

        $scope.sort_order = $scope.sort_options[0].value;
        
        var limit = 50,
            currentPage = 0,
            totalPages = 0;

        rgiDocumentSrvc.query({skip: currentPage, limit: limit}, function (response) {
            $scope.count = response.count;
            $scope.documents = response.data;
            totalPages = response.count / limit;
            currentPage = currentPage + 1;
        });
        $scope.loadMoreDocs = function() {
            if(currentPage < totalPages) {
                rgiDocumentSrvc.query({skip: currentPage, limit: limit}, function (response) {

                    response.data.forEach(function (doc) {
                        $scope.documents.push(doc);
                    });
                    currentPage = currentPage + 1;
                });
            }
        };
    });
