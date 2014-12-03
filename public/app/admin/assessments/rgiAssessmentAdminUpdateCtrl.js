angular.module('app').controller('rgiAssessmentAdminUpdateCtrl', function($scope, rgiAssessmentsSrvc, $routeParams) {
	$scope.assessment = rgiAssessmentsSrvc.get({assessment_ID:$routeParams.assessment_ID});
})