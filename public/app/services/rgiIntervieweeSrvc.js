angular.module('app').factory('rgiIntervieweeSrvc', function ($resource) {
    'use strict';
    var IntervieweeResource = $resource('/api/interviewees/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false}
    });

    return IntervieweeResource;
});