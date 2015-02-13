// query base questions or get base question by id
/*global angular */
'use strict';

var app = angular.module('app').factory('rgiQuestionSrvc', function ($resource) {
    var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false},
    });

    return QuestionResource;
});