angular.module('app').factory('rgiUser', function($resource) {
	var UserResource = $resource('/api/users/:id', {_id: "@id"});

	UserResource.prototype.isSupervisor = function() {
		return this.roles && this.roles.indexOf('supervisor') > -1;
	}

	return UserResource;
});