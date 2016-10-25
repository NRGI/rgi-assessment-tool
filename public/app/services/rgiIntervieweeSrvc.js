'use strict';
/*jslint nomen: true */
angular.module('app')
    .factory('rgiIntervieweeSrvc', ['$resource', function ($resource) {
        return $resource('/api/interviewees/:_id', {_id: '@id'}, {
            get: {method: 'GET', cache: true},
            update: {method: 'PUT', isArray: false}
        });
    }]);