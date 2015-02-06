angular.module('app').controller('rgiAssessmentDashboardDetailCtrl', function($scope, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, $routeParams) {
	rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID}, function(data) {
		$scope.assessment = data;
		$scope.reviewer = rgiUserListSrvc.get({_id:$scope.assessment.reviewer_ID});
		$scope.researcher = rgiUserListSrvc.get({_id:$scope.assessment.researcher_ID});
		$scope.answers = rgiAnswerSrvc.query({assessment_ID:$routeParams.assessment_ID})
		console.log($scope.answers);
		
		// rgiAssessmentSrvc.query({[currentUser.roles[0] + "_ID"]:currentUser._id},function(data) {
		// 	// pull assessment list from collection and adds user name to match reviewer id and researcher id
		// 	$scope.assessments = [];
		// 	for (var i = data.length - 1; i >= 0; i--) {
		// 		var assessment = data[i];
		// 		if(assessment.reviewer_ID != undefined) {
		// 			assessment.reviewer = rgiUserListSrvc.get({_id:assessment.reviewer_ID});
		// 			assessment.researcher = rgiUserListSrvc.get({_id:assessment.researcher_ID});
		// 		};
				
		// 		$scope.assessments.push(assessment);
		// 	};
		// });
	});
});