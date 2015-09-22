'use strict';
/*jslint nomen: true */
angular.module('app').factory('rgiIntervieweeSrvc', function ($resource) {
    var IntervieweeResource = $resource('/api/interviewees/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false}
    });

    return IntervieweeResource;
});