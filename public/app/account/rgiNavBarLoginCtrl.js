angular.module('app').controller('rgiNavBarLoginCtrl', function($scope, $http, rgiIdentitySrvc, rgiNotifier, rgiAuthSrvc, $location) {
	$scope.identity = rgiIdentitySrvc;
	$scope.signin = function(username, password) {
		rgiAuthSrvc.authenticateUser(username, password).then(function(success) {
			if(success) {
				rgiNotifier.notify('You have successfully signed in!');
			} else {
				rgiNotifier.notify('Username/Password combination incorrect');
			}
		});
	}

	$scope.signout = function() {
		rgiAuthSrvc.logoutUser().then(function() {
			$scope.username = "";
			$scope.password = "";
			rgiNotifier.notify('You have successfully signed out!');
			$location.path('/');
		})
	}
});