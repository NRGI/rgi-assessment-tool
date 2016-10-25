'use strict';

angular.module('app').factory('rgiFileUploaderSrvc', ['FileUploader', function (FileUploader) {
    return {
        get: function(options) {
            return new FileUploader(options);
        }
    };
}]);