angular.module('app').controller('rgiMainCtrl', function($scope, rgiAuthSrvc, rgiIdentitySrvc) {
	// bring in current user data to customize front page
	if(rgiIdentitySrvc=='') {
		$scope.fullName = rgiIdentitySrvc.currentUser.firstName + " " + rgiIdentitySrvc.currentUser.lastName;
		$scope.roles = rgiIdentitySrvc.currentUser.roles;
	}
	
});