'use strict';

describe('rgiSortableGuideSrvc', function () {
    var rgiAnswerFilterSrvc;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiAnswerFilterSrvc_) {
        rgiAnswerFilterSrvc = _rgiAnswerFilterSrvc_;
    }));

    describe('#getAnswers', function() {
        var REGULAR_ANSWER = {title: 'Regular Answer', question_trial: false},
            TRIAL_ANSWER = {title: 'Trial Answer', question_trial: true};

        ['researcher_trial', 'reviewer_trial', 'trial_started', 'trial_submitted'].forEach(function(status) {
            it('uses trial answers only if the assessment status is ' + status, function() {
                rgiAnswerFilterSrvc.getAnswers([TRIAL_ANSWER, REGULAR_ANSWER], {status: status}).should.deep
                    .equal([TRIAL_ANSWER]);
            });
        });

        it('uses trial answers only if the assessment status is ' + status, function() {
            rgiAnswerFilterSrvc.getAnswers([TRIAL_ANSWER, REGULAR_ANSWER], {status: 'researcher_started'}).should.deep
                .equal([TRIAL_ANSWER, REGULAR_ANSWER]);
        });
    });
});
