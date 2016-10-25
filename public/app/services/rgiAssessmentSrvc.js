'use strict';

angular.module('app').factory('rgiAssessmentSrvc', ['$resource', function ($resource) {
    return $resource('/api/assessments/:assessment_ID', {assessment_ID: '@assessment_ID'}, {
        getCached: {method: 'GET', isArray: false, cache: true},
        update: {method: 'PUT', isArray: false}
    });
}]);
