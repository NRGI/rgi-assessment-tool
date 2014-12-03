angular.module('app').controller('rgiUserAdminCtrl', function($scope, rgiUserSrvc) {
  	$scope.users = rgiUserSrvc.query();

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