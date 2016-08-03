'use strict';

angular.module('app')
    .factory('rgiAnswerRawSrvc', function ($resource) {
        return $resource('/api/raw_answers/:limit/:skip/:answer_ID', {_id: '@answer_ID', limit: "@limit", skip: "@skip"}, {
            query: {method: 'GET', isArray: false, cache: true}
        });
    });
