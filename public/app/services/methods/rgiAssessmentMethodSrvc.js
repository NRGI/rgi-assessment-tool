'use strict';

angular.module('app')
    .factory('rgiAssessmentMethodSrvc', ['rgiAssessmentSrvc', 'rgiResourceProcessorSrvc', function (
        rgiAssessmentSrvc,
        rgiResourceProcessorSrvc
    ) {
        return {
            createAssessment: function (assessmentsData) {
                var assessments = new rgiAssessmentSrvc(assessmentsData);
                assessments.length = assessmentsData.length;
                return rgiResourceProcessorSrvc.process(assessments, '$save');
            },
            updateAssessment: function (assessment) {
                return rgiResourceProcessorSrvc.process(assessment, '$update');
            },
            deleteAssessment: function (assessmentId) {
                return rgiResourceProcessorSrvc.delete(rgiAssessmentSrvc, assessmentId, 'assessment_ID');
            }
        };
    }]);
