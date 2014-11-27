angular.module('app').factory('rgiQuestion', function($resource) {
	var QuestionResource = $resource('/api/questions/:id', {id: '@id'}, {
		update: {method: 'PUT', isArray: false}
	});

	return QuestionResource;
})