// query assessments or get assessments by id
angular.module('app').factory('rgiAssessmentsSrvc', function($resource) {
	var AssessmentResource = $resource('/api/assessments/:assessment_ID', {assessment_ID: '@assessment_ID'}, {
		update: {method: 'PUT', isArray: false}
	});

	return AssessmentResource;
});