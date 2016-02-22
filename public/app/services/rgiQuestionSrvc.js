'use strict';

angular.module('app')
    .factory('rgiQuestionSrvc', function ($resource) {
        var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
            update: {method: 'PUT', isArray: false}
        });

        return QuestionResource;
    });