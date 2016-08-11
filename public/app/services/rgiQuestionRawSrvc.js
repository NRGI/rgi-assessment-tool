'use strict';

angular.module('app')
    .factory('rgiQuestionRawSrvc', function ($resource) {
        return $resource('/api/raw-questions/:limit/:skip', {limit: "@limit", skip: "@skip"}, {
            query: {method: 'GET', isArray: true, cache: true}
        });
    });
