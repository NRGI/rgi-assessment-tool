angular.module('app').controller('rgiAnswerCtrl', function($scope, $routeParams, rgiAnswerSrvc, rgiAssessmentSrvc, rgiQuestionSrvc) {
	// $scope.answer = rgiAnswerSrvc.get({answer_ID:$routeParams.answer_ID});

	rgiAnswerSrvc.get({answer_ID:$routeParams.answer_ID}, function(data) {
		$scope.answer = data;
		$scope.assessment = rgiAssessmentSrvc.get({assessment_ID:data.assessment_ID});
		$scope.question = rgiQuestionSrvc.get({_id:data.question_ID});
		var origAnswer = angular.copy($scope.answer);
		// rgiAnswerSrvc.query({assessment_ID:assessment_data.assessment_ID}, function(answer_data) {
		// 	for (var i = 0; i < answer_data.length; i++) {
		// 		answer = answer_data[i];
		// 		answer.question_text = rgiQuestionTextSrvc.get({_id:answer.question_ID});
		// 		$scope.answers.push(answer);
		// 	};
		// });
	});

	$scope.answerSubmit = function() {
		console.log($scope.referenceFileUpload);
	};

	$scope.answerClear = function() {
		// $scope.answer = angular.copy(origAnswer);
		// $scope.answerForm.$setPristine();
	};

	$scope.uploadFile = function() {

	};

	
});


// angular.module('app').controller('rgiAssessmentDetailCtrl', function($scope, $routeParams, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, rgiQuestionSrvc, rgiQuestionTextSrvc) {
	
// 	rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID},function(assessment_data) {
// 		$scope.assessment = assessment_data;
// 		$scope.assessment.reviewer = rgiUserListSrvc.get({_id:assessment_data.reviewer_ID});
// 		$scope.assessment.researcher = rgiUserListSrvc.get({_id:assessment_data.researcher_ID});
// 		$scope.answers = [];
// 		rgiAnswerSrvc.query({assessment_ID:assessment_data.assessment_ID}, function(answer_data) {
// 			for (var i = 0; i < answer_data.length; i++) {
// 				answer = answer_data[i];
// 				answer.question_text = rgiQuestionTextSrvc.get({_id:answer.question_ID});
// 				$scope.answers.push(answer);
// 			};
// 		});
// 	});
// })