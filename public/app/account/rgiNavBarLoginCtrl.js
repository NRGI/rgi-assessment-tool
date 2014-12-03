angular.module('app').controller('rgiNavBarLoginCtrl', function($scope, $http, rgiIdentitySrvc, rgiNotifier, rgiAuthSrvc, $location) {
	// assign the identity resource with the current identity using identity service
	$scope.identity = rgiIdentitySrvc;
	// signin function for signin button
	$scope.signin = function(username, password) {
		rgiAuthSrvc.authenticateUser(username, password).then(function(success) {
			if(success) {
				rgiNotifier.notify('You have successfully signed in!');
			} else {
				rgiNotifier.notify('Username/Password combination incorrect');
			}
		});
	}
	// signout function for signout button
	$scope.signout = function() {
		rgiAuthSrvc.logoutUser().then(function() {
			$scope.username = "";
			$scope.password = "";
			rgiNotifier.notify('You have successfully signed out!');
			$location.path('/');
		})
	}
});