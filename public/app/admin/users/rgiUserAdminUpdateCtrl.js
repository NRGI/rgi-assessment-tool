angular.module('app').controller('rgiUserAdminUpdateCtrl', function($scope, rgiUser, rgiAuth, rgiNotifier, $routeParams) {
	var user = rgiUser.get({_id:$routeParams.id});
	$scope.user = user;

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

		rgiAuth.updateUserAdmin(newUserData).then(function() {
			rgiNotifier.notify('User account has been updated');
		}, function(reason) {
			rgiNotifier.notify(reason);
		});
	}
})