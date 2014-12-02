angular.module('app').factory('rgiUserMap', function($resource) {
	
	var UserResource = $resource('/api/users/:_id', {_id: "@id"}, {
		update: {method: 'PUT', isArray:false}
	});

	return UserResource;
});