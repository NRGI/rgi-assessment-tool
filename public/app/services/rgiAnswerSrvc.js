'use strict';

angular.module('app')
    .factory('rgiAnswerSrvc', function ($resource) {
        var AnswerResource = $resource('/api/answers/:answer_ID', {answer_ID: '@answer_ID'}, {
            update: {method: 'PUT', isArray: false}
        });

        return AnswerResource;
    })
    .factory('rgiAnswerRawSrvc', function ($resource) {
        var AnswerRawResource = $resource('/api/raw_answers/:answer_ID', {answer_ID: '@answer_ID'}, {
            query: {method: 'GET', isArray: false}
        });

        return AnswerRawResource;
    });