'use strict';

angular.module('app')
    .factory('rgiAssessmentMethodSrvc', function (
        $q,
        rgiAssessmentSrvc,
        rgiHttpResponseProcessorSrvc
    ) {
        var saveAssessment = function(assessment, action) {
            var dfd = $q.defer();

            assessment[action]().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(rgiHttpResponseProcessorSrvc.getMessage(response, 'Save assessment failure'));
                rgiHttpResponseProcessorSrvc.handle(response);
            });

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
    });
