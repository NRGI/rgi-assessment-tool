angular.module('app').controller('rgiNavBarLoginCtrl', function($scope, $http, rgiIdentity, rgiNotifier, rgiAuth, $location) {
	$scope.identity = rgiIdentity;
	$scope.signin = function(username, password) {
		rgiAuth.authenticateUser(username, password).then(function(success) {
			if(success) {
				rgiNotifier.notify('You have successfully signed in!');
			} else {
				rgiNotifier.notify('Username/Password combination incorrect');
			}
		});
	}

	$scope.signout = function() {
		rgiAuth.logoutUser().then(function() {
			$scope.username = "";
			$scope.password = "";
			rgiNotifier.notify('You have successfully signed out!');
			$location.path('/');
		})
	}
});