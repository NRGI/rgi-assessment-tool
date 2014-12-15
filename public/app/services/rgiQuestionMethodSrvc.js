angular.module('app').factory('rgiQuestionMethodSrvc', function($http, $q, rgiIdentitySrvc, rgiUserSrvc) {
	return {
		updateQuestion: function(newQuestionData) {
			var dfd = $q.defer();
			console.log(newQuestionData);
			// newQuestionData.$update().then(function() {
			// 	dfd.resolve();
			// }), function(response) {
			// 	dfd.reject(response.data.reason);
			// };
			return dfd.promise;
		}
	}	
});