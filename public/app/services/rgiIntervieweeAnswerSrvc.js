'use strict';

angular.module('app')
    .factory('rgiIntervieweeAnswerSrvc', function ($resource) {
        return $resource('/api/interviewee-answers/:answers', {answers: '@answers'});
    });
