angular.module('app').controller('rgiMainCtrl', function($scope, rgiAuth, rgiIdentity) {
	// bring in current user data to customize front page
	if(rgiIdentity=='') {
		$scope.fullName = rgiIdentity.currentUser.firstName + " " + rgiIdentity.currentUser.lastName;
		$scope.roles = rgiIdentity.currentUser.roles;
	}
	
});