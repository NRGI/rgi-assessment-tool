angular.module('app').controller('rgiAssessmentsListCtrl', function($scope, rgiAssessmentSrvc, rgiUserListSrvc, rgiIdentitySrvc) {

	var currentUser = rgiIdentitySrvc.currentUser;
 	
 	rgiAssessmentSrvc.query({[currentUser.roles[0] + "_ID"]:currentUser._id},function(data) {
		// pull assessment list from collection and adds user name to match reviewer id and researcher id
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
				assessment.reviewer = rgiUserListSrvc.get({_id:assessment.reviewer_ID});
				assessment.researcher = rgiUserListSrvc.get({_id:assessment.researcher_ID});
			};
			
			$scope.assessments.push(assessment);
		};
	});
	
	$scope.sortOptions = [{value:'country',text:'Sort by Country'},
		{value:'start_date', text:'Date started'},
		{value:'status', text:'Status'}]
	$scope.sortOrder = $scope.sortOptions[0].value;

	console.log($scope.assessments);
	
});