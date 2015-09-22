'use strict';
//var angular;
/*jslint nomen: true */

// query base questions or get base question by id
angular.module('app').factory('rgiIntervieweeSrvc', function ($resource) {
    var IntervieweeResource = $resource('/api/interviewees/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false}
    });

    return IntervieweeResource;
});