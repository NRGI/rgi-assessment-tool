angular.module('app').factory('rgiAssessment', function($resource) {
	var AssessmentResource = $resource('/api/assessments/:nav_ID', {nav_ID: '@id'}, {
		update: {method: 'PUT', isArray: false}
	});

	return AssessmentResource;
})