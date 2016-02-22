'use strict';

angular.module('app')
    .factory('rgiUploadMethodSrvc', function (
        $q,
        rgiUploadSrvc
    ) {
        return {
            upload: function (fileItem) {
                console.log('.url');
                var newUpload = new rgiUploadSrvc(fileItem),
                    dfd = $q.defer();
                newUpload.test = 'test';
                console.log(newUpload);

                newUpload.$save().then(function () {
                    dfd.resolve();
                }, function (res) {
                    dfd.reject(res.data.reason);
                });
                return dfd.promise;
            }
        };
    });