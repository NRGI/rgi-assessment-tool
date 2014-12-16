// query answers
angular.module('app').factory('rgiAnswerSrvc', function($resource) {
	var AnswerResource = $resource('/api/answers/:answer_ID', {answer_ID: '@answer_ID'}, {
		// insert: {method: 'POST', isArray: true},	
		update: {method: 'PUT', isArray: false}
	});

	return AnswerResource;
})