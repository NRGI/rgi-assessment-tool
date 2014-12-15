// query base questions or get base question by id
angular.module('app').factory('rgiQuestionSrvc', function($resource) {
	var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
		update: {method: 'PUT', isArray: false},

		// updateQuestion: function(newQuestionData) {
		// 	var dfd = $q.defer();
		// 	console.log(newQuestionData);
		// 	newQuestionData.$update().then(function() {
		// 		dfd.resolve();
		// 	}), function(response) {
		// 		dfd.reject(response.data.reason);
		// 	};
		// 	return dfd.promise;
		// }	
	});

	return QuestionResource;
})