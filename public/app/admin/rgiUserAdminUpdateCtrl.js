angular.module('app').controller('rgiUserAdminUpdateCtrl', function($scope, rgiUser, $routeParams) {
	var user = rgiUser.get({_id:$routeParams.id});
	$scope.user = user;

	// // $scope.update = function() {
	// // 	var newUserData = {
	// // 		firstName: $scope.fname,
	// // 		lastName: $scope.lname,
	// // 		email: $scope.email
	// // 	}
	// // 	if($scope.password && $scope.passowrd.length > 0) {
	// // 		newUserData.password = $scope.password;
	// // 	}

	// // 	rgiAuth.updateCurrentUser(newUserData).then(function() {
	// // 		rgiNotifier.notify('Your user account has been updated');
	// // 	}, function(reason) {
	// // 		rgiNotifier.notify(reason);
	// // 	});
	// }
})