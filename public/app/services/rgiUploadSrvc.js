'use strict';
angular.module('app')
    .factory('rgiUploadSrvc', function ($resource) {
        var UploadResource = $resource('/file-upload', {}, {});

        return UploadResource;
    });