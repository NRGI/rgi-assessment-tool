'use strict';

angular.module('app')
    .factory('rgiQuestionSrvc', function ($resource) {
        return $resource('/api/questions/:_id', {_id: '@id'}, {
            queryCached: {method: 'GET', isArray: true, cache: true},
            update: {method: 'PUT', isArray: false}
        });
    });