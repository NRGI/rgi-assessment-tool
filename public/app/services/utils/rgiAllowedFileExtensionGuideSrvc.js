'use strict';

angular.module('app').factory('rgiAllowedFileExtensionGuideSrvc', function () {
    return {
        getList: function() {
            return ['csv', 'doc', 'docx', 'jpeg', 'jpg', 'pdf', 'png', 'xlsx'];
        }
    };
});