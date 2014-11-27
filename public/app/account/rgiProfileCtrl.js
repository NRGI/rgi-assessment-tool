angular.module('app').controller('rgiProfileCtrl', function($scope, rgiIdentity, rgiNotifier) {
	$scope.fullName = rgiIdentity.currentUser.firstName + " " + rgiIdentity.currentUser.lastName;
	$scope.fname = rgiIdentity.currentUser.firstName;
	$scope.lname = rgiIdentity.currentUser.lastName;
	$scope.email = rgiIdentity.currentUser.email;
	$scope.username = rgiIdentity.currentUser.username;
	$scope.roles = rgiIdentity.currentUser.roles;

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