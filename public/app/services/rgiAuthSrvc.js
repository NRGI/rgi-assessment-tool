angular.module('app').factory('rgiAuthSrvc', function($http, $q, rgiIdentitySrvc, rgiUserSrvc) {
	return {
		// AUTHENTICATION AND AUTHORIZATION
		//authentication
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
		//logout
		logoutUser: function() {
			var dfd = $q.defer();
			$http.post('/logout', {logout:true}).then(function() {
				rgiIdentitySrvc.currentUser = undefined;
				dfd.resolve();
			});
			return dfd.promise;
		},
		//authorize for specific route based on role
		authorizeCurrentUserForRoute: function(role) {
			if(rgiIdentitySrvc.isAuthorized(role)) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		},
		//limit route to authenticated users
		authorizeAuthenticatedUserForRoute: function() {
			if(rgiIdentitySrvc.isAuthenticated()) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		},
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
		updateUser: function(newUserData, user) {

			var dfd = $q.defer();

			// var clone = user;
			angular.extend(user, newUserData);

			user.$update().then(function() {
				dfd.resolve();
			}), function(response) {
				dfd.reject(response.data.reason);
			};
			return dfd.promise;
		},


		
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
		}
	}	
});