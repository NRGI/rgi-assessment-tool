'use strict';

angular.module('app').factory('rgiUserAssessmentsSrvc', ['rgiUserMethodSrvc', function (rgiUserMethodSrvc) {
    var updateUser = function(user) {
        return rgiUserMethodSrvc.updateUser(user).$promise;
    };

    return {
        add: function(user, assessment) {
            user.assessments.push({
                assessment_ID: assessment.assessment_ID,
                country_name: assessment.country
            });
            return updateUser(user);
        },
        remove: function(user, assessment) {
            var assessmentIndex = -1;

            user.assessments.forEach(function(userAssessment, i) {
                if (assessment.assessment_ID === userAssessment.assessment_ID) {
                    if (i > -1) {
                        assessmentIndex = i;
                    }
                }
            });

            user.assessments.splice(assessmentIndex, 1);
            return updateUser(user);
        }
    };
}]);