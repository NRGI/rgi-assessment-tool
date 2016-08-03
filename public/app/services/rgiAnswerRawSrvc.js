'use strict';

angular.module('app')
    .factory('rgiAnswerRawSrvc', function ($resource) {
        return $resource('/api/raw_answers/:limit/:skip', {limit: "@limit", skip: "@skip"}, {
            query: {method: 'GET', isArray: true, cache: true}
        });
    });
