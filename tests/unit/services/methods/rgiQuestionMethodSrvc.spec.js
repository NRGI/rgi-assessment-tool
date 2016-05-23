'use strict';

describe('rgiQuestionMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiQuestionMethodSrvc, rgiQuestionSrvc, rgiResourceProcessorSrvc, spy, stub, expectedPromise, actualPromise,
        setStub = function(method) {
            spy = sinon.spy(function() {return expectedPromise;});
            stub = sinon.stub(rgiResourceProcessorSrvc, method, spy);
        };

    beforeEach(inject(function (_rgiQuestionMethodSrvc_, _rgiQuestionSrvc_, _rgiResourceProcessorSrvc_) {
        rgiResourceProcessorSrvc = _rgiResourceProcessorSrvc_;
        rgiQuestionSrvc = _rgiQuestionSrvc_;
        rgiQuestionMethodSrvc = _rgiQuestionMethodSrvc_;
    }));

    describe('#deleteQuestion', function () {
        var questionId;

        beforeEach(function() {
            questionId = 'QUESTION ID';
            expectedPromise = 'EXPECTED DELETE PROMISE';
            setStub('delete');
            actualPromise = rgiQuestionMethodSrvc.deleteQuestion(questionId);
        });

        it('returns a promise', function () {
            actualPromise.should.be.equal(expectedPromise);
        });

        it('sends data for processing', function () {
            spy.withArgs(rgiQuestionSrvc, questionId).called.should.be.equal(true);
        });
    });

    describe('#updateQuestion', function () {
        var question;

        beforeEach(function() {
            question = 'QUESTION';
            expectedPromise = 'EXPECTED UPDATE PROMISE';
            setStub('process');
            actualPromise = rgiQuestionMethodSrvc.updateQuestion(question);
        });

        it('returns a promise', function () {
            actualPromise.should.be.equal(expectedPromise);
        });

        it('sends data for processing', function () {
            spy.withArgs(question, '$update').called.should.be.equal(true);
        });
    });

    afterEach(function () {
        stub.restore();
    });
});