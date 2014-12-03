angular.module('app').factory('rgiAuthSrvc', function($http, rgiIdentitySrvc, $q, rgiUserSrvc) {
	return {
		// AUTHENTICATION
		authenticateUser: function(username, password) {
			var dfd = $q.defer();
			$http.post('/login', {username:username, password:password}).then(function(response) {
				if(response.data.success) {
					var user = new rgiUserSrvc();
					angular.extend(user, response.data.user);
					rgiIdentitySrvc.currentUser = user;
					dfd.resolve(true);
				} else {
					dfd.resolve(false);
				}
			});
			return dfd.promise;
		},
		// USER CREATION LOOK AT THIS AND FIX
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
		// createUser: function(newUserData) {
		// 	var newUser = new rgiUserSrvc(newUserData);
		// 	var dfd = $q.defer();

		// 	newUser.$save().then(function() {
		// 		rgiIdentitySrvc.currentUser = newUser;
		// 		dfd.resolve();
		// 	}, function(response) {
		// 		dfd.reject(response.data.reason);
		// 	});
		// 	return dfd.promise;
		// },
		// USER UPDATES LOOK AT THIS AND FIX
		updateCurrentUser: function(newUserData) {
			var dfd = $q.defer();

			var clone = angular.copy(rgiIdentitySrvc.currentUser);
			angular.extend(clone, newUserData);
			clone.$update().then(function() {
				rgiIdentitySrvc.currentUser = clone;
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
		// LOGOUT
		logoutUser: function() {
			var dfd = $q.defer();
			$http.post('/logout', {logout:true}).then(function() {
				rgiIdentitySrvc.currentUser = undefined;
				dfd.resolve();
			});
			return dfd.promise;
		},
		// AUTHORIZE FOR SPECIFIC ROUTE BASED ON ROLE
		authorizeCurrentUserForRoute: function(role) {
			if(rgiIdentitySrvc.isAuthorized(role)) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		},
		// LIMIT ROUTE TO AUTHENTICATED USERS
		authorizeAuthenticatedUserForRoute: function() {
			if(rgiIdentitySrvc.isAuthenticated()) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		}
	}	
});