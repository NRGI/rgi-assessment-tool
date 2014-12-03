angular.module('app').factory('rgiUserRoleSrvc', function($resource) {
	var UserResource = $resource('/api/user-roles/:role', {role: "@role"}, {
		get: {method: 'GET', isArray:true}
	});

	return UserResource;
});