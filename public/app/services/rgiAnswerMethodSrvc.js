angular.module('app').factory('rgiAnswerMethodSrvc', function($http, $q, rgiIdentitySrvc, rgiAnswerSrvc) {
	return {
		updateAnswerSet: function(newAnswerSet) {
			console.log(newAnswerSet);
		}

		// updateAnswer: function(newAnswerData) {
		// 	var dfd = $q.defer();
		// 	console.log(newAnswerData);
		// 	newAnswerData.$update().then(function() {
		// 		dfd.resolve();
		// 	}), function(response) {
		// 		dfd.reject(response.data.reason);
		// 	};
		// 	return dfd.promise;
		// }
	}	
});