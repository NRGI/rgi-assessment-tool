// query assessments or get assessments by id
/*global angular */
'use strict';

var app = angular.module('app').factory('rgiAssessmentSrvc', function ($resource) {
    var AssessmentResource = $resource('/api/assessments/:assessment_ID', {assessment_ID: '@assessment_ID'}, {
        update: {method: 'PUT', isArray: false}
    });

    return AssessmentResource;
});