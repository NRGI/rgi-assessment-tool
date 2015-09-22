angular.module('app').factory('rgiAssessmentSrvc', function ($resource) {
    'use strict';
    var AssessmentResource = $resource('/api/assessments/:assessment_ID', {assessment_ID: '@assessment_ID'}, {
        update: {method: 'PUT', isArray: false}
    });

    return AssessmentResource;
});