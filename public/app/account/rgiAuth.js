angular.module('app').factory('rgiAuth', function($http, rgiIdentity, $q, rgiUser) {
	return {
		authenticateUser: function(username, password) {
			var dfd = $q.defer();
			$http.post('/login', {username:username, password:password}).then(function(response) {
				if(response.data.success) {
					var user = new rgiUser();
					angular.extend(user, response.data.user);
					rgiIdentity.currentUser = user;
					dfd.resolve(true);
				} else {
					dfd.resolve(false);
				}
			});
			return dfd.promise;
		},
		createUser: function(newUserData) {
			var newUser = new rgiUser(newUserData);
			var dfd = $q.defer();

			newUser.$save().then(function() {
				dfd.resolve();
			}, function(response) {
				dfd.reject(response.data.reason);
			});
			return dfd.promise;
		},
		// createUser: function(newUserData) {
		// 	var newUser = new rgiUser(newUserData);
		// 	var dfd = $q.defer();

		// 	newUser.$save().then(function() {
		// 		rgiIdentity.currentUser = newUser;
		// 		dfd.resolve();
		// 	}, function(response) {
		// 		dfd.reject(response.data.reason);
		// 	});
		// 	return dfd.promise;
		// },
		updateCurrentUser: function(newUserData) {
			var dfd = $q.defer();

			var clone = angular.copy(rgiIdentity.currentUser);
			angular.extend(clone, newUserData);
			clone.$update().then(function() {
				rgiIdentity.currentUser = clone;
				dfd.resolve();
			}, function(response) {
				dfd.reject(response.data.reason);
			});
			return dfd.promise;
		},
		updateUserAdmin: function(newUserData) {
			var dfd = $q.defer();

			newUserData.$update().then(function() {
				dfd.resolve();
			}), function(response) {
				dfd.reject(response.data.reason);
			};
			return dfd.promise;
		},
		logoutUser: function() {
			var dfd = $q.defer();
			$http.post('/logout', {logout:true}).then(function() {
				rgiIdentity.currentUser = undefined;
				dfd.resolve();
			});
			return dfd.promise;
		},
		authorizeCurrentUserForRoute: function(role) {
			if(rgiIdentity.isAuthorized(role)) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		},
		authorizeAuthenticatedUserForRoute: function() {
			if(rgiIdentity.isAuthenticated()) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		}
	}	
});