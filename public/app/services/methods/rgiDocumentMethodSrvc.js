'use strict';

angular.module('app')
    .factory('rgiDocumentMethodSrvc', function ($q, rgiDocumentSrvc) {
        return {
            updateDocument: function (new_doc_data) {
                var dfd = $q.defer();

                new_doc_data.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            deleteDocument: function (documentId) {
                var
                    dfd = $q.defer(),
                    doc = new rgiDocumentSrvc();

                doc.id = documentId;

                doc.$delete().then(function (response) {
                    dfd.resolve(response);
                }, function (response) {
                    dfd.reject(response.data.reason);
                });

                return dfd.promise;
            }
        };
    });
