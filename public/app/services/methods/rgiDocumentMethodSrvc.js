angular
    .module('app')
    .factory('rgiDocumentMethodSrvc', function ($q) {
        'use strict';
        return {
            updateDocument: function (new_doc_data) {
                var dfd = $q.defer();

                new_doc_data.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            }
        };
    });