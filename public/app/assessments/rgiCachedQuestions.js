angular.module('app').factory('rgiCachedQuestions', function(rgiQuestion) {
	var questionList;

	return {
		query: function() {
			if(!questionList) {
				questionList = rgiQuestion.query();
			}

			return questionList;
		}
	}
})