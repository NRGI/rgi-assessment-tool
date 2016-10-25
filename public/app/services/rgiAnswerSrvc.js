'use strict';

angular.module('app')
    .factory('rgiAnswerSrvc', ['$resource', function ($resource) {
        return $resource('/api/answers/:answer_ID', {answer_ID: '@answer_ID'}, {
            update: {method: 'PUT', isArray: false}
        });
    }]);
