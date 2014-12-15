angular.module('app').factory('rgiUserMethodSrvc', function($http, $q, rgiIdentitySrvc, rgiUserSrvc) {
	return {
		createUser: function(newUserData) {
			var newUser = new rgiUserSrvc(newUserData);
			var dfd = $q.defer();

			newUser.$save().then(function() {
				dfd.resolve();
			}, function(response) {
				dfd.reject(response.data.reason);
			});
			return dfd.promise;
		},
		deleteUser: function(userDeletion) {
			var dfd = $q.defer();

			userDeletion.$remove().then(function() {
				dfd.resolve();
			}), function(response) {
				dfd.reject(response.data.reason);
			};
			return dfd.promise;
		},
		updateUser: function(newUserData) {
			var dfd = $q.defer();
			// console.log(newUserData);
			newUserData.$update().then(function() {
				dfd.resolve();
			}), function(response) {
				dfd.reject(response.data.reason);
			};
			return dfd.promise;
		},
		assignUser: function(newUserData) {
			var dfd = $q.defer();

			console.log(newUserData);

			return dfd.promise;
		}
		// // USER UPDATES LOOK AT THIS AND FIX
		// updateCurrentUser: function(newUserData) {
		// 	var dfd = $q.defer();

		// 	var clone = angular.copy(rgiIdentitySrvc.currentUser);
		// 	angular.extend(clone, newUserData);
		// 	clone.$update().then(function() {
		// 		rgiIdentitySrvc.currentUser = clone;
		// 		dfd.resolve();
		// 	}, function(response) {
		// 		dfd.reject(response.data.reason);
		// 	});
		// 	return dfd.promise;
		// }
	}	
});