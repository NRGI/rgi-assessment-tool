angular.module('app').factory('rgiUserList', function($resource) {
	var UserResource = $resource('/api/user-list/:_id', {_id: "@id"}, {
		update: {method: 'PUT', isArray:false}
	});

	return UserResource;
});