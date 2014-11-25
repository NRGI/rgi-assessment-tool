// angular.module('app').factory('rgiQuestions', function($resource) {
// 	var UserResource = $resource('/api/questions/:id', {_id: "@id"});

// 	UserResource.prototype.isSupervisor = function() {
// 		return this.roles && this.roles.indexOf('supervisor') > -1;
// 	}

// 	return UserResource;
// });