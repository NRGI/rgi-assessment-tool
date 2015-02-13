// query answers
/*global angular */
'use strict';

var app = angular.module('app').factory('rgiAnswerSrvc', function ($resource) {
    var AnswerResource = $resource('/api/answers/:answer_ID', {answer_ID: '@answer_ID'}, {
        update: {method: 'PUT', isArray: false}
    });

    return AnswerResource;
});