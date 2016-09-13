'use strict';

angular.module('app')
    .factory('rgiAnswerRawSrvc', function ($resource) {
        return $resource('/api/raw_answers/:limit/:skip/:country', {country: '@country', limit: '@limit', skip: '@skip'}, {
            query: {method: 'GET', isArray: false, cache: true}
        });
    });
