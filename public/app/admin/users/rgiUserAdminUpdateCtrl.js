angular.module('app').controller('rgiUserAdminUpdateCtrl', function($scope, $routeParams, rgiNotifier, rgiUserSrvc, rgiUserMethodSrvc) {
	var user = rgiUserSrvc.get({_id:$routeParams.id});
	$scope.user = user;
	// fix submit button functionality
	$scope.userUpdate = function() {
		var newUserData = $scope.user;

		if($scope.password && $scope.password.length > 0) {
			if($scope.password === $scope.password_rep) {
				newUserData.password = $scope.password;
				rgiUserMethodSrvc.updateUser(newUserData).then(function() {
					rgiNotifier.notify('User account has been updated');
				}, function(reason) {
					rgiNotifier.error(reason);
				});
			}else{
				rgiNotifier.error('Passwords must match!')
			}
		} else {
			rgiUserMethodSrvc.updateUser(newUserData).then(function() {
				rgiNotifier.notify('User account has been updated');
			}, function(reason) {
				rgiNotifier.error(reason);
			});
		};
	};

	$scope.userDelete = function() {
		var userDeletion = $scope.user;
		rgiUserMethodSrvc.deleteUser(userDeletion).then(function() {
			$location.path('/admin/user-admin');
			rgiNotifier.notify('User account has been deleted');
		}, function(reason) {
			rgiNotifier.error(reason);
		});
	};
})