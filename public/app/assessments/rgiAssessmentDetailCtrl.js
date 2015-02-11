angular.module('app').controller('rgiAssessmentDetailCtrl', function($scope, $routeParams, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, rgiQuestionSrvc, rgiQuestionTextSrvc) {
	
	rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID},function(assessment_data) {
		$scope.assessment = assessment_data;
		$scope.assessment.reviewer = rgiUserListSrvc.get({_id:assessment_data.reviewer_ID});
		$scope.assessment.researcher = rgiUserListSrvc.get({_id:assessment_data.researcher_ID});
		$scope.answers = rgiAnswerSrvc.query({assessment_ID:assessment_data.assessment_ID});
		// $scope.answers = [];
		// rgiAnswerSrvc.query({assessment_ID:assessment_data.assessment_ID}, function(answer_data) {
		// 	for (var i = 0; i < answer_data.length; i++) {
		// 		answer = answer_data[i];
		// 		answer.question_text = rgiQuestionTextSrvc.get({_id:answer.question_ID});
		// 		$scope.answers.push(answer);
		// 	};
		// });

		$scope.sortOptions = 	[	
									{value: "question_order", text: "Sort by Question Number"},
									{value: "component_id", text: "Sort by Component"},
									{value: "status", text: "Sort by Status"}
								];
		$scope.sortOrder = $scope.sortOptions[0].value;

	});
});

angular.module('app').filter('capitalize', function() {
	return function(input, all) {
		return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
});