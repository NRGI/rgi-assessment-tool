angular.module('app').controller('rgiAssessmentAdminAssignCtrl', function($scope, rgiAssessmentsSrvc, rgiUserListSrvc, rgiUserRoleSrvc, $routeParams, $q){
	// get all researchers
	$scope.researchers = rgiUserRoleSrvc.get({role:'researcher'});
	// get all reviewers
	$scope.reviewers = rgiUserRoleSrvc.get({role:'reviewer'});
	// get assessment that needs to be updated
	$scope.assessment = rgiAssessmentsSrvc.get({assessment_ID:$routeParams.assessment_ID});
	
	// needs a submit button for posting data. should validate both researcher and reviewer
	// and post to both user and assessment database and send emails with details. 
});