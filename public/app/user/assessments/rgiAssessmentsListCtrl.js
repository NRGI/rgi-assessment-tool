angular.module('app').controller('rgiAssessmentsListCtrl', function($scope, rgiAssessmentSrvc, rgiIdentitySrvc) {
	// $scope.reviewers = rgiUserSrvc.query({roles:'reviewer'});
	// { $or: [{a: 1}, {b: 1}] },
	var currentUser = rgiIdentitySrvc.currentUser;
 	$scope.assessments = rgiAssessmentSrvc.query({[currentUser.roles[0] + "_ID"]:currentUser._id});
	// console.log($scope.assessments);
	// // rgiIdentitySrvc.currentUser._id
	$scope.sortOptions = [{value:'country',text:'Sort by Country'},
		{value:'start_date', text:'Date started'},
		{value:'status', text:'Status'}]
	$scope.sortOrder = $scope.sortOptions[0].value;
	
});