'use strict';

angular.module('app')
    .factory('rgiDocumentMethodSrvc', function (
        rgiDocumentSrvc,
        rgiResourceProcessorSrvc
    ) {
        return {
            updateDocument: function (doc) {
                return rgiResourceProcessorSrvc.process(doc, '$update');
            },
            deleteDocument: function (documentId) {
                return rgiResourceProcessorSrvc.delete(rgiDocumentSrvc, documentId);
            }
        };
    });
