angular.module('app').controller('rgiAssessmentDashboardCtrl', function($scope, rgiAssessmentSrvc, rgiUserListSrvc, $routeParams) {
	rgiAssessmentSrvc.query(function(data) {
		
		$scope.assessments = [];
		for (var i = data.length - 1; i >= 0; i--) {
			var assessment = data[i];
			if(assessment.reviewer_ID != undefined) {
				assessment.reviewer = rgiUserListSrvc.get({_id:assessment.reviewer_ID});
				assessment.researcher = rgiUserListSrvc.get({_id:assessment.researcher_ID});
			};
			$scope.assessments.push(assessment);
		};
	}); 
	// filtering options
	$scope.sortOptions = [{value:'country',text:'Sort by Country'},
		{value:'start_date', text:'Date started'},
		{value:'status', text:'Status'}]
	$scope.sortOrder = $scope.sortOptions[0].value;
});