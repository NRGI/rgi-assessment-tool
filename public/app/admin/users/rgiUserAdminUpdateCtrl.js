angular.module('app').controller('rgiUserAdminUpdateCtrl', function($scope, $routeParams, rgiUserSrvc, rgiAuthSrvc, rgiNotifier) {
	var user = rgiUserSrvc.get({_id:$routeParams.id});
	$scope.user = user;
	// fix submit button functionality
	$scope.userUpdate = function() {
		var newUserData = {
			firstName: $scope.user.firstName,
			lastName: $scope.user.lastName,
			email: $scope.user.email,
			address: $scope.user.address,
			language: $scope.user.language
		};

		if($scope.password && $scope.password.length > 0) {
			if($scope.password === $scope.password_rep) {
				newUserData.password = $scope.password;
			}else{
				rgiNotifier.error('Passwords must match!')
			}	
		};

		rgiAuthSrvc.updateUser(newUserData, user).then(function() {
			rgiNotifier.notify('User account has been updated');
		}, function(reason) {
			rgiNotifier.error(reason);
		});
	};

	$scope.userDelete = function() {

	};
})