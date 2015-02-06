angular.module('app').controller('rgiAssessmentDashboardDetailCtrl', function($scope, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, rgiQuestionSrvc, $routeParams) {
	rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID}, function(data) {
		$scope.assessment = data;
		$scope.reviewer = rgiUserListSrvc.get({_id:$scope.assessment.reviewer_ID});
		$scope.researcher = rgiUserListSrvc.get({_id:$scope.assessment.researcher_ID});
		$scope.answers = rgiAnswerSrvc.query({assessment_ID:$routeParams.assessment_ID})

		$scope.sortOptions = 	[	
									{value: "order", text: "Sort by Question Number"},
									{value: "component_text", text: "Sort by Component"},
									{value: "status", text: "Sort by Status"}
								];
		$scope.sortOrder = $scope.sortOptions[0].value;

		// // for (var i = 0; i < $scope.answers.length; i++) {
		// // 	var question_text = rgiQuestionSrvc.get({_id:$scope.answers[i].question_ID});
		// // 	$scope.answers[i] = question_text;
		// // };

		// rgiAnswerSrvc.query({assessment_ID:$routeParams.assessment_ID}, function(data) {
		// 	// pull answer list from collection and add question text

		// 	$scope.answers = [];
		// 	for (var i = data.length - 1; i >= 0; i--) {
		// 		var answers = data[i];
		// 		var question = rgiQuestionSrvc.get({_id:answers.question_ID});
		// 		answers.question_text = question.question_text;
		// 	// 	if(answers.question_ID != undefined) {
		// 	// 		
		// 	// 	};				
		// 		$scope.answers.push(answers);
		// 	};
		// });
	});
});