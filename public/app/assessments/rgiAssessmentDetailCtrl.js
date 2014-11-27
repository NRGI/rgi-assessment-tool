angular.module('app').controller('rgiAssessmentDetailCtrl', function($scope, rgiAssessment, $routeParams) {
	$scope.assessment = rgiAssessment.get({nav_ID:$routeParams.nav_ID})

	// .query();

	// $scope.sortOptions = 	[	{value: "order", text: "Sort by Question Order"},
	// 							{value: "component", text: "Sort by Component"},
	// 							{value: "status", text: "Sort by Status"}
	// 						];
	// $scope.sortOrder = $scope.sortOptions[0].value;
})