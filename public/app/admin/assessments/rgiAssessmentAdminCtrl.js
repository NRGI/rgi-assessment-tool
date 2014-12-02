angular.module('app').controller('rgiAssessmentAdminCtrl', function($scope, rgiAssessments, rgiUser, rgiUserList, $routeParams) {
	
	rgiAssessments.query(function(data) {
		// $scope.assessments = data;
		// $scope.extra = data;
		$scope.assessments = [];
		for (var i = data.length - 1; i >= 0; i--) {
			var assessment = {
				assessment_ID: data[i].assessment_ID,
				country: data[i].country,
				researcher_ID: data[i].researcher_ID,
				reviewer_ID: data[i].reviewer_ID,
				start_date: data[i].start_date,
				status: data[i].status
			};
			if(assessment.reviewer_ID != undefined) {
				assessment.reviewer = rgiUserList.get({_id:assessment.reviewer_ID});
				assessment.researcher = rgiUserList.get({_id:assessment.researcher_ID});
			};
			
			// assessment.reviewer = reviewer.firstName;
			$scope.assessments.push(assessment);
		};
	}); 
	// $scope.assessments = rgiAssessments.query(function(req, res){
	// 	return "yes"
	// });
	// $scope.extra = rgiUser.get({_id:$scope.assessments[0].researcher});
	
	// for (var i = assessments.length - 1; i >= 0; i--) {
	// 	$scope.extra.append($scope.assessments[i].reviewer_ID);
	// };
	// var researcher = 
	// $scope.researcher = researcher;

	// for (var i = $scope.assessments.length - 1; i >= 0; i--) {
	// 	var researcher = rgiUser.get({_id:$scope.assessments[i].researcher_ID});
	// 	$scope.assessments[i].researcher = researcher;
	// };
	

	// $scope.assessments.researcher = researcher;
	// assessment.researcher_ID
	// assessment.reviewer_ID

	$scope.sortOptions = [{value:'country',text:'Sort by Country'},
		{value:'start_date', text:'Date started'},
		{value:'status', text:'Status'}]
	$scope.sortOrder = $scope.sortOptions[0].value;
});