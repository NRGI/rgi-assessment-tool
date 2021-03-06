'use strict';

angular.module('app')
    .factory('rgiAssessmentStatisticsGuideSrvc', ['rgiIdentitySrvc', 'rgiQuestionSetSrvc', function (rgiIdentitySrvc, rgiQuestionSetSrvc) {
        return {
            getCounterSetTemplate: function(callback) {
                rgiQuestionSetSrvc.loadQuestions(function() {
                    callback({
                        length: rgiQuestionSetSrvc.getAvailableQuestions(rgiIdentitySrvc.currentUser.role, true).length,
                        complete: 0,
                        flagged: 0,
                        submitted: 0,
                        approved: 0,
                        resubmitted: 0,
                        assigned: 0,
                        saved: 0,
                        unresolved: 0,
                        finalized: 0
                    });
                });
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
    }]);
