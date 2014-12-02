angular.module('app').controller('rgiAssessmentAdminUpdateCtrl', function($scope, rgiAssessments, $routeParams) {
	$scope.assessment = rgiAssessments.get({assessment_ID:$routeParams.assessment_ID});
})