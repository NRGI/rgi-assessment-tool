'use strict';

angular.module('app')
    .factory('rgiUploadMethodSrvc', function (
        $q,
        rgiUploadSrvc
    ) {
        return {
            upload: function (fileItem) {
                var newUpload = new rgiUploadSrvc(fileItem),
                    dfd = $q.defer();
                newUpload.test = 'test';

                newUpload.$save().then(function () {
                    dfd.resolve();
                }, function (res) {
                    dfd.reject(res.data.reason);
                });
                return dfd.promise;
            }
        };
    });