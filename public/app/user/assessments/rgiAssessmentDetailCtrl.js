angular.module('app').controller('rgiAssessmentDetailCtrl', function($scope, $routeParams, rgiAssessmentSrvc) {
	$scope.assessment = rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID});
})