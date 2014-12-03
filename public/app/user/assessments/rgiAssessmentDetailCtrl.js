angular.module('app').controller('rgiAssessmentDetailCtrl', function($scope, rgiAssessmentsSrvc, $routeParams) {
	$scope.assessment = rgiAssessmentsSrvc.get({assessment_ID:$routeParams.assessment_ID});
})