angular.module('app').controller('rgiAssessmentsListCtrl', function($scope, rgiAssessments) {
	$scope.assessments = rgiAssessments.query();

	$scope.sortOptions = [{value:'country',text:'Sort by Country'},
		{value:'start_date', text:'Date started'},
		{value:'status', text:'Status'}]
	$scope.sortOrder = $scope.sortOptions[0].value;
	
});