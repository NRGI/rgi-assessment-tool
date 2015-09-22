angular.module('app').factory('rgiQuestionSrvc', function ($resource) {
    'use strict';
    var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false},
    });

    return QuestionResource;
});