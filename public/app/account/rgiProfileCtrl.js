angular.module('app').controller('rgiProfileCtrl', function($scope, rgiAuth, rgiIdentity, rgiNotifier) {
	$scope.email = rgiIdentity.currentUser.username;
	$scope.fname = rgiIdentity.currentUser.firstName;
	$scope.lname = rgiIdentity.currentUser.lastName;

	$scope.update = function() {
		var newUserData = {
			username: $scope.email,
			firstName: $scope.fname,
			lastName: $scope.lname
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