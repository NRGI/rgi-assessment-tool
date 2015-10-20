'use strict';

angular.module('app').factory('rgiUrlCheckSrvc', function ($q, rgiRequestSubmitterSrvc) {
    return {
        isReal: function(url) {
            var dfd = $q.defer();

            rgiRequestSubmitterSrvc.get(
                'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' +
                encodeURIComponent(url) + '%22&format=json'
            ).then(function(response) {
                if (response.data.results) {
                    dfd.resolve(true);
                } else {
                    dfd.reject(false);
                }
            }, function() {
                dfd.reject('failed');
            });

            return dfd.promise;
        }
    };
});