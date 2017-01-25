'use strict';

describe('rgiSortableGuideSrvc', function () {
    var rgiPreceptGuideSrvc;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiPreceptGuideSrvc_) {
        rgiPreceptGuideSrvc = _rgiPreceptGuideSrvc_;
    }));

    describe('#getPrecepts', function() {
        it('returns a predefined set of precept data', function() {
            rgiPreceptGuideSrvc.getPrecepts().should.deep.equal([
                {value: 1, text: 'Precept 1: Strategy, consultation and institutions'},
                {value: 2, text: 'Precept 2: Accountability and transparency'},
                {value: 3, text: 'Precept 3: Exploration and license allocation'},
                {value: 4, text: 'Precept 4: Taxation'},
                {value: 5, text: 'Precept 5: Local effects'},
                {value: 6, text: 'Precept 6: State-owned enterprise'},
                {value: 7, text: 'Precept 7: Revenue distribution'},
                {value: 8, text: 'Precept 8: Revenue volatility'},
                {value: 9, text: 'Precept 9: Government spending'},
                {value: 10, text: 'Precept 10: Private sector development'},
                {value: 11, text: 'Precept 11: Roles of international companies'},
                {value: 12, text: 'Precept 12: Roles of international actors'}
            ]);
        });
    });

    describe('CUSTOM DATA FORMAT', function() {
        var expectedResult;

        beforeEach(function() {
            expectedResult = [
                {id: 'precept_1', label: 'Precept 1: Strategy, consultation and institutions'},
                {id: 'precept_2', label: 'Precept 2: Accountability and transparency'},
                {id: 'precept_3', label: 'Precept 3: Exploration and license allocation'},
                {id: 'precept_4', label: 'Precept 4: Taxation'},
                {id: 'precept_5', label: 'Precept 5: Local effects'},
                {id: 'precept_6', label: 'Precept 6: State-owned enterprise'},
                {id: 'precept_7', label: 'Precept 7: Revenue distribution'},
                {id: 'precept_8', label: 'Precept 8: Revenue volatility'},
                {id: 'precept_9', label: 'Precept 9: Government spending'},
                {id: 'precept_10', label: 'Precept 10: Private sector development'},
                {id: 'precept_11', label: 'Precept 11: Roles of international companies'},
                {id: 'precept_12', label: 'Precept 12: Roles of international actors'}
            ];

            expectedResult.forEach(function(precept) {
                precept.data = [];
            });
        });

        describe('#getQuestionTemplates', function() {
            it('returns a predefined set of precept data', function() {
                rgiPreceptGuideSrvc.getQuestionTemplates().should.deep.equal(expectedResult);
            });
        });

        describe('#getAnswerTemplates', function() {
            it('returns a predefined set of precept data', function() {
                expectedResult.forEach(function(precept) {
                    ['complete', 'approved', 'flagged', 'unresolved', 'finalized', 'modified'].forEach(function(field) {
                        precept[field] = 0;
                    });
                });

                rgiPreceptGuideSrvc.getAnswerTemplates().should.deep.equal(expectedResult);
            });
        });
    });
});
