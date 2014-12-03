angular.module('app').controller('rgiUserAdminUpdateCtrl', function($scope, rgiUserSrvc, rgiAuthSrvc, rgiNotifier, $routeParams) {
	var user = rgiUserSrvc.get({_id:$routeParams.id});
	$scope.user = user;
	// fix submit button functionality
	$scope.update = function() {
		var newUserData = {
			firstName: $scope.user.firstName,
			lastName: $scope.user.lastName,
			email: $scope.user.email,
			address: $scope.user.address,
			language: $scope.user.language
		}

		if($scope.password1 && $scope.password1.length > 0) {
			if($scope.password1 === $scope.password2) {
				newUserData.password = $scope.user.password1;
			}else{
				rgiNotifier.notify('Passwords must match!')
			}	
		}
		console.log(newUserData);

		rgiAuthSrvc.updateUserAdmin(newUserData).then(function() {
			rgiNotifier.notify('User account has been updated');
		}, function(reason) {
			rgiNotifier.notify(reason);
		});
	}
})