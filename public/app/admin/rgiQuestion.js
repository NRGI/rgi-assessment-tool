angular.module('app').factory('rgiQuestion', function($resource) {
	var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
		update: {method: 'PUT', isArray: false}
	});

	return QuestionResource;
})