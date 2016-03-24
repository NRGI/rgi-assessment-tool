'use strict';

angular.module('app')
    .factory('rgiIntervieweeMethodSrvc', function (
        rgiIntervieweeSrvc,
        rgiResourceProcessorSrvc
    ) {
        return {
            createInterviewee: function (newIntervieweeData) {
                return rgiResourceProcessorSrvc.process(new rgiIntervieweeSrvc(newIntervieweeData), '$save');
            },
            deleteInterviewee: function (intervieweeId) {
                return rgiResourceProcessorSrvc.delete(rgiIntervieweeSrvc, intervieweeId);
            },
            updateInterviewee: function (interviewee) {
                return rgiResourceProcessorSrvc.process(interviewee, '$update');
            }
        };
    });
