'use strict';

angular.module('app').factory('rgiAnswerFilterSrvc', function () {
    return {
        getAnswers: function(originalAnswers, assessment) {
            var answers = [];

            originalAnswers.forEach(function(answer) {
                var trialStatuses = ['researcher_trial', 'reviewer_trial', 'trial_started', 'trial_submitted'];

                if(answer.question_trial || (trialStatuses.indexOf(assessment.status) === -1)) {
                    answers.push(answer);
                }
            });

            return answers;
        }
    };
});
