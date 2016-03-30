'use strict';

angular.module('app').factory('rgiAllowedFileExtensionGuideSrvc', function () {
    var allowedExtensions = ['csv', 'doc', 'docx', 'jpeg', 'jpg', 'pdf', 'png', 'xlsx', 'rtf'];

    return {
        getList: function() {
            return allowedExtensions;
        },
        getSerializedList: function() {
            return allowedExtensions.join(', ');
        }
    };
});