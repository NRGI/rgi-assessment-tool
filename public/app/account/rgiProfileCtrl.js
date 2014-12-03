angular.module('app').controller('rgiProfileCtrl', function($scope, rgiIdentitySrvc, rgiNotifier) {
	$scope.fullName = rgiIdentitySrvc.currentUser.firstName + " " + rgiIdentitySrvc.currentUser.lastName;
	$scope.fname = rgiIdentitySrvc.currentUser.firstName;
	$scope.lname = rgiIdentitySrvc.currentUser.lastName;
	$scope.email = rgiIdentitySrvc.currentUser.email;
	$scope.username = rgiIdentitySrvc.currentUser.username;
	$scope.roles = rgiIdentitySrvc.currentUser.roles;

	$scope.update = function() {
		var newUserData = {
			firstName: $scope.fname,
			lastName: $scope.lname,
			email: $scope.email
		}
		if($scope.password && $scope.passowrd.length > 0) {
			newUserData.password = $scope.password;
		}

		rgiAuth.updateCurrentUser(newUserData).then(function() {
			rgiNotifier.notify('Your user account has been updated');
		}, function(reason) {
			rgiNotifier.notify(reason);
		});
	}
})