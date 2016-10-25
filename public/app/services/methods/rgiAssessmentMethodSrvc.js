'use strict';

angular.module('app')
    .factory('rgiAssessmentMethodSrvc', ['$q', 'rgiAssessmentSrvc', 'rgiHttpResponseProcessorSrvc', function (
        $q,
        rgiAssessmentSrvc,
        rgiHttpResponseProcessorSrvc
    ) {
        var saveAssessment = function(assessment, action) {
            var dfd = $q.defer();

            assessment[action]().then(dfd.resolve,
                rgiHttpResponseProcessorSrvc.getDeferredHandler(dfd, 'Save assessment failure'));

            return dfd.promise;
        };

        return {
            createAssessment: function (assessmentsData) {
                var assessments = new rgiAssessmentSrvc(assessmentsData);
                assessments.length = assessmentsData.length;
                return saveAssessment(assessments, '$save');
            },
            updateAssessment: function (assessment) {
                return saveAssessment(assessment, '$update');
            }
        };
    }]);
