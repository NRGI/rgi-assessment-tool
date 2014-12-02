angular.module('app').factory('rgiAssessments', function($resource) {
	var AssessmentResource = $resource('/api/assessments/:assessment_ID', {assessment_ID: '@assessment_ID'}, {
		update: {method: 'PUT', isArray: false}
	});

	return AssessmentResource;
});