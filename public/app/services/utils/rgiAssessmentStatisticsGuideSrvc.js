'use strict';

angular.module('app').factory('rgiAssessmentStatisticsGuideSrvc', function (rgiQuestionSetSrvc) {
    var getCurrentQuestionSetLength = function(answers) {
        var questionsNumber = 0;

        answers.forEach(function(answer) {
            if(rgiQuestionSetSrvc.isAvailable(answer)) {
                questionsNumber++;
            }
        });

        return questionsNumber;
    };

    return {
        getCounterSetTemplate: function(answers) {
            return {
                length: getCurrentQuestionSetLength(answers),
                complete: 0,
                flagged: 0,
                submitted: 0,
                approved: 0,
                resubmitted: 0,
                assigned: 0,
                saved: 0,
                unresolved: 0,
                finalized: 0
            };
        },
        updateCounters: function(answer, counterSet, assessment) {
            switch (answer.status) {
                case 'flagged':
                    counterSet.flagged++;
                    counterSet.complete++;
                    break;
                case 'submitted':
                    counterSet.submitted++;
                    counterSet.complete++;
                    break;
                case 'approved':
                    counterSet.approved++;
                    counterSet.complete++;
                    break;
                case 'unresolved':
                    counterSet.unresolved++;
                    if (['under_review', 'resubmitted'].indexOf(assessment.status) > -1) {
                        counterSet.complete++;
                    }
                    break;
                case 'final':
                    counterSet.finalized++;
                    counterSet.complete++;
                    break;
                case 'resubmitted':
                    counterSet.resubmitted++;
                    break;
                case 'assigned':
                    counterSet.assigned++;
                    break;
                case 'saved':
                    counterSet.saved++;
                    break;
            }
        }
    };
});