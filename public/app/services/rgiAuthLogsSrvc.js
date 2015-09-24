'use strict';

angular.module('app').factory('rgiAuthLogsSrvc', function (rgiRequestSubmitterSrvc) {
    return {
        getTotalNumber: function(userId) {
            return rgiRequestSubmitterSrvc.get('/api/auth-logs/number/' + userId);
        },
        list: function(userId, itemsPerPage, page) {
            return rgiRequestSubmitterSrvc.get('/api/auth-logs/list/' + userId + '/' + itemsPerPage + '/' + page);
        }
    };
});