angular.module('app').factory('rgiUser', function($resource) {
	var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
		update: {method: 'PUT', isArray:false}
	});

	UserResource.prototype.isSupervisor = function() {
		return this.roles && this.roles.indexOf('supervisor') > -1;
	};

	UserResource.prototype.isReviewer = function() {
		return this.roles && this.roles.indexOf('reviewer') > -1;
	};

	UserResource.prototype.isResearcher = function() {
		return this.roles && this.roles.indexOf('researcher') > -1;
	};

	return UserResource;
});