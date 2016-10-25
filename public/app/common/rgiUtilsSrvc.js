'use strict';

angular.module('app')
    .factory('rgiUtilsSrvc', ['$http', '$q', function ($http, $q) {
        return {
            flagCheck: function (flags) {
                var disabled = false;
                if (flags.length !== 0) {
                    flags.forEach(function (el) {
                        if (el.addressed === false) {
                            disabled = true;
                        }
                    });
                }
                return disabled;
            },
            zeroFill: function (number, width) {
                width -= number.toString().length;
                if (width > 0) {
                    return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
                }
                return number + ""; // always return a string
            },
            isURLReal: function (url) {
                var deferred = $q.defer();

                $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=json')
                    .then(function(response) {
                        if (response.data.query.results) {
                            deferred.resolve(true);
                        } else {
                            deferred.reject(false);
                        }
                    }, function () {
                        deferred.reject(undefined);
                    });

                return deferred.promise;
            }
        };
    }]);