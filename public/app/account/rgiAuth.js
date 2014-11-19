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
		}
	}	
});