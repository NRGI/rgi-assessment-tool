'use strict';
var angular;

angular.module('app').factory('rgiRequestSubmitterSrvc', function ($http, $q) {
    return {
        submit: function (uri, data) {
            var dfd = $q.defer();

            $http.post(uri, data).then(function (response) {
                dfd.resolve(response);
            }, function () {
                dfd.reject();
            });

            return dfd.promise;
        }
    };
});