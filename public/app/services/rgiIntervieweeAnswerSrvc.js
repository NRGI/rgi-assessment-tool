'use strict';

angular.module('app')
    .factory('rgiIntervieweeAnswerSrvc', ['$resource', function ($resource) {
        return $resource('/api/interviewee-answers/:answers', {answers: '@answers'});
    }]);
