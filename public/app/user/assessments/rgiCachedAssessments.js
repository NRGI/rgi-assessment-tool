angular.module('app').factory('rgiCachedQuestions', function(rgiQuestionSrvc) {
	var questionList;

	return {
		query: function() {
			if(!questionList) {
				questionList = rgiQuestionSrvc.query();
			}

			return questionList;
		}
	}
})