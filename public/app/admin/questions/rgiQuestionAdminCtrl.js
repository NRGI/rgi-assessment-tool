angular.module('app').controller('rgiQuestionAdminCtrl', function($scope, rgiQuestionSrvc) {
	$scope.questions = rgiQuestionSrvc.query();

	$scope.sortOptions = 	[	
								{value: "order", text: "Sort by Question Order"},
								{value: "component", text: "Sort by Component"},
								{value: "status", text: "Sort by Status"}
							];
	$scope.sortOrder = $scope.sortOptions[0].value;
})