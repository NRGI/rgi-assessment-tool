'use strict';

angular
    .module('app')
    .factory('rgiUtilsSrvc', function (
    ) {
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
            isURLReal: function (fullyQualifiedURL) {
                var URL = encodeURIComponent(fullyQualifiedURL),
                    dfd = $.Deferred(),
                    checkURLPromise = $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + URL + '%22&format=json');

                checkURLPromise
                    .done(function(res) {
                        // results should be null if the page 404s or the domain doesn't work
                        if (res.query.results) {
                            dfd.resolve(true);
                        } else {
                            dfd.reject(false);
                        }
                    })
                    .fail(function () {
                        dfd.reject('failed');
                    });
                return dfd.promise();
            }
        };
    });

////////////////////////////////////////////////////////////
//'use strict';
//
//angular.module('app').factory('rgiFileUploaderSrvc', function (FileUploader) {
//    return {
//        get: function(options) {
//            return new FileUploader(options);
//        }
//    };
//});
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//'use strict';
//
//angular.module('app').factory('rgiRequestSubmitterSrvc', function ($http, $q) {
//    var submitRequest = function(type, uri, data) {
//        var dfd = $q.defer();
//
//        $http[type](uri, data).then(function (response) {
//            dfd.resolve(response);
//        }, function () {
//            dfd.reject();
//        });
//
//        return dfd.promise;
//    };
//
//    return {
//        get: function(uri) {
//            return submitRequest('get', uri, {});
//        },
//        submit: function (uri, data) {
//            return submitRequest('post', uri, data);
//        }
//    };
//});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//'use strict';
//
//angular.module('app').factory('rgiUrlCheckSrvc', function ($q, rgiRequestSubmitterSrvc) {
//    return {
//        isReal: function(url) {
//            var dfd = $q.defer();
//
//            rgiRequestSubmitterSrvc.get(
//                'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' +
//                encodeURIComponent(url) + '%22&format=json'
//            ).then(function(response) {
//                    if (response.data.results) {
//                        dfd.resolve(true);
//                    } else {
//                        dfd.reject(false);
//                    }
//                }, function() {
//                    dfd.reject('failed');
//                });
//
//            return dfd.promise;
//        }
//    };
//});
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////