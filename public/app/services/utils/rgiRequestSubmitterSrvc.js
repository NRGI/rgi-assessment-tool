'use strict';

angular.module('app').factory('rgiRequestSubmitterSrvc', function ($http, $q) {
    var submitRequest = function(type, uri, data) {
        var dfd = $q.defer();

        $http[type](uri, data).then(function (response) {
            dfd.resolve(response);
        }, function () {
            dfd.reject();
        });
//=======
//angular.module('app').factory('rgiRequestSubmitterSrvc', function ($http, $q) {
//    'use strict';
//    return {
//        submit: function (uri, data) {
//            var dfd = $q.defer();
//>>>>>>> address jshint for public folder

        return dfd.promise;
    };

    return {
        get: function(uri) {
            return submitRequest('get', uri, {});
        },
        submit: function (uri, data) {
            return submitRequest('post', uri, data);
        }
    };
});