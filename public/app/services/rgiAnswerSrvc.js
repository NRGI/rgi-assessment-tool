angular.module('app').factory('rgiAnswerSrvc', function ($resource) {
    'use strict';
    var AnswerResource = $resource('/api/answers/:answer_ID', {answer_ID: '@answer_ID'}, {
        update: {method: 'PUT', isArray: false}
    });

    return AnswerResource;
});