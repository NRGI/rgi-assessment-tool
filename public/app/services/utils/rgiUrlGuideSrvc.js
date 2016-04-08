'use strict';

angular.module('app').factory('rgiUrlGuideSrvc', function (rgiIdentitySrvc, rgiUtilsSrvc) {
    var urlGuide = {
        getAssessmentsUrl: function() {
            return rgiIdentitySrvc.currentUser.role === 'supervisor' ? '/admin/assessments-admin' : '/assessments';
        },
        getAssessmentUrl: function(assessmentId) {
            return urlGuide.getAssessmentsUrl()  + '/' + assessmentId;
        },
        getAnswerUrl: function(assessmentId, answerOrder) {
            return urlGuide.getAssessmentsUrl()  + '/answer/' + assessmentId + "-" +
                String(rgiUtilsSrvc.zeroFill(answerOrder, 3));
        }
    };

    return urlGuide;
});
