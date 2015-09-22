angular.module('app').factory('rgiUploadSrvc', function ($resource) {
    'use strict';
    var UploadResource = $resource('/file-upload', {}, {});

    return UploadResource;
});