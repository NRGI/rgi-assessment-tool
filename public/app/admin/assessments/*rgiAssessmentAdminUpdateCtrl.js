angular.module('app').controller('rgiAssessmentAdminUpdateCtrl', function($scope, rgiAssessmentSrvc, $routeParams) {
	$scope.assessment = rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID});
})