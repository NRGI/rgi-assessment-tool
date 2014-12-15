angular.module('app').controller('rgiAssessmentDashboardDetailCtrl', function($scope, rgiAssessmentSrvc, rgiUserListSrvc, $routeParams) {
	rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID}, function(data) {
		$scope.assessment = data;
		$scope.reviewer = rgiUserListSrvc.get({_id:$scope.assessment.reviewer_ID});
		$scope.researcher = rgiUserListSrvc.get({_id:$scope.assessment.researcher_ID});
	});
});