angular.module('app').factory('rgiUserListSrvc', function($resource) {
	var UserResource = $resource('/api/user-list/:_id', {_id: "@id"}, {
		update: {method: 'PUT', isArray:false}
	});

	return UserResource;
});