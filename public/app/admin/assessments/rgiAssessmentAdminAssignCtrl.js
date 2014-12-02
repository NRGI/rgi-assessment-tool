angular.module('app').controller('rgiAssessmentAdminAssignCtrl', function($scope, rgiAssessments, rgiUser, $routeParams){
	$scope.assessment = rgiAssessments.get({assessment_ID:$routeParams.assessment_ID});

	$scope.researchers = rgiUsers.get({role:$routeParams.role});

	$scope.users = rgiUser.query();

	$scope.researchers = [{value:'547c9269d56df758a465c358',text:'Jim Cust'}];
	$scope.researcherSelect = null;

	$scope.reviewers = [{value:'547c9269d56df758a465c358',text:'Jim Cust'}];
	$scope.reviewerSelect = null;
});