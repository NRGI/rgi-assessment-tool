angular.module('app').controller('rgiUserAdminCtrl', function($scope, rgiUserSrvc, rgiAssessmentSrvc) {

  	rgiUserSrvc.query({}, function(data){
  		$scope.users = []
  		for (var i = data.length - 1; i >= 0; i--) {
  			for (var j = data[i].assessments.length - 1; j >= 0; j--) {
  				data[i].assessments[j].details = rgiAssessmentSrvc.get({assessment_ID: data[i].assessments[j].assessment_id});
  			};
  			$scope.users.push(data[i]);
  		 }; 
  	});

	$scope.sortOptions = 	[	
								{value: "firstName", text: "Sort by First Name"},
								{value: "lastName", text: "Sort by Last Name"},
								{value: "username", text: "Sort by Username"},
								{value: "roles[0]", text: "Sort by Role"},
								{value: "approved", text: "Sort by Approved"},
								{value: "submitted", text: "Sort by Submitted"}
							];
	$scope.sortOrder = $scope.sortOptions[1].value;
});