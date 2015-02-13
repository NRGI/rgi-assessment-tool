// query users or get user by id and return only first and last name and email
/*global angular */
'use strict';

var app = angular.module('app').factory('rgiQuestionTextSrvc', function ($resource) {
    var UserResource = $resource('/api/question-text/:_id', {_id: "@id"}, {});

    return UserResource;
});