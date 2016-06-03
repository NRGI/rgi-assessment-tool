'use strict';

describe('rgiQuestionSetSrvc', function () {
    var rgiQuestionSetSrvc,
        rgiHttpResponseProcessorSrvc , rgiQuestionSrvc,
        spies = {}, stubs = {};

    beforeEach(module('app'));

    beforeEach(inject(function(
        _rgiQuestionSetSrvc_,
        _rgiHttpResponseProcessorSrvc_,
        _rgiQuestionSrvc_
    ) {
        rgiQuestionSetSrvc = _rgiQuestionSetSrvc_;

        rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
        rgiQuestionSrvc = _rgiQuestionSrvc_;
    }));

    describe('#loadQuestions', function() {
        var actualErrorHandler, expectedErrorHandler = 'ERROR HANDLER';

        beforeEach(function() {
            spies.questionQueryCached = sinon.spy(function(criteria, callback, errorHandler) {
                callback([]);
                actualErrorHandler = errorHandler;
            });
            spies.questionQueryCached = sinon.stub(rgiQuestionSrvc, 'queryCached', spies.questionQueryCached);

            spies.httpResponseProcessorGetDefaultHandler = sinon.spy(function() {
                return expectedErrorHandler;
            });
            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                spies.httpResponseProcessorGetDefaultHandler);

            spies.loadQuestionsCallback = sinon.spy();
            rgiQuestionSetSrvc.loadQuestions(spies.loadQuestionsCallback);
        });

        it('processes HTTP failure', function() {
            spies.loadQuestionsCallback.called.should.be.equal(true);
            spies.httpResponseProcessorGetDefaultHandler.withArgs('Load question data failure').called.should.be.equal(true);
        });

        it('sends a cached request to get questions', function() {
            spies.questionQueryCached.withArgs({assessment_ID: 'base'}).called.should.be.equal(true);
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
