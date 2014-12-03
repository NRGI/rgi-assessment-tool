angular.module('app').controller('rgiAssessmentAdminAssignCtrl', function($scope, rgiAssessmentsSrvc, rgiUserListSrvc, rgiUserRoleSrvc, $routeParams, $q){
	$scope.researchers = rgiUserRoleSrvc.get({role:'researcher'});
	$scope.reviewers = rgiUserRoleSrvc.get({role:'reviewer'});
	$scope.assessment = rgiAssessmentsSrvc.get({assessment_ID:$routeParams.assessment_ID});
});