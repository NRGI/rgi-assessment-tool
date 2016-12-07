'use strict';

angular.module('app')
    .factory('rgiUnlinkDocumentSrvc', ['$resource', function ($resource) {
        return $resource('/api/unlink-document/:documentId', {documentId: '@documentId'});
    }]);
