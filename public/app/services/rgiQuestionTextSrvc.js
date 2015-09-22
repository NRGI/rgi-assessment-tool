angular.module('app').factory('rgiQuestionTextSrvc', function ($resource) {
    'use strict';
    var UserResource = $resource('/api/question-text/:_id', {_id: "@id"}, {});

    return UserResource;
});