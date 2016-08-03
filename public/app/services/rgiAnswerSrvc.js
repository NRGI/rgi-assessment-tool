'use strict';

angular.module('app')
    .factory('rgiAnswerSrvc', function ($resource) {
        return $resource('/api/answers/:answer_ID', {answer_ID: '@answer_ID'}, {
            update: {method: 'PUT', isArray: false}
        });
    });
