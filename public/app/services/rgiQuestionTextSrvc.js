'use strict';

angular.module('app')
    .factory('rgiQuestionTextSrvc', function ($resource) {
        var UserResource = $resource('/api/question-text/:_id', {_id: "@id"}, {});

        return UserResource;
    });