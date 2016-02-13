'use strict';

angular.module('app').factory('rgiAssessmentRolesGuideSrvc', function () {
    return {
        list: function() {
            return ['researcher', 'reviewer', 'ext_reviewer'];
        }
    };
});