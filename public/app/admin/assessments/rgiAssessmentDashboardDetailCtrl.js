angular.module('app').controller('rgiAssessmentDashboardDetailCtrl', function($scope, rgiAssessmentsSrvc, rgiUserListSrvc, $routeParams) {
	rgiAssessmentsSrvc.get({assessment_ID:$routeParams.assessment_ID}, function(data) {
		$scope.assessment = data;
		$scope.reviewer = rgiUserListSrvc.get({_id:$scope.assessment.reviewer_ID});
		$scope.researcher = rgiUserListSrvc.get({_id:$scope.assessment.researcher_ID});
	});
});