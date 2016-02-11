'use strict';

angular.module('app').factory('rgiAllowedFileExtensionGuideSrvc', function () {
    var allowedExtensions = ['csv', 'doc', 'docx', 'jpeg', 'jpg', 'pdf', 'png', 'xlsx'];

    return {
        getList: function() {
            return allowedExtensions;
        },
        getSerializedList: function() {
            return allowedExtensions.join(', ');
        }
    };
});