'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');

utils.stubModel();
    var questionsModule = rewire(utils.getControllerPath('questions'));
utils.restoreModel();

describe('`questions` module', function() {
    var callbacks = {}, spies = {};

    describe('#getQuestions', function() {
        var QUERY = 'QUERY';

        beforeEach(function() {
            spies.questionFind = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.questionFind = callback;
                }};
            });

            spies.responseSend = sinon.spy();
            utils.setModuleLocalVariable(questionsModule, 'Question', {find: spies.questionFind});
            questionsModule.getQuestions({query: QUERY}, {send: spies.responseSend});
        });

        it('creates a request to get a question collection', function() {
            expect(spies.questionFind.withArgs(QUERY).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('responds with question collection if no error occurs', function() {
                var QUESTIONS = 'questions';
                callbacks.questionFind(null, QUESTIONS);
                expect(spies.responseSend.withArgs(QUESTIONS).called).to.equal(true);
            });

            it('responds with the error description if an error occurs', function() {
                var ERROR = 'error';
                callbacks.questionFind(ERROR);
                expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
            });
        });
    });

    describe('#getQuestionByID', function() {
        var ID = 'ID';

        beforeEach(function() {
            spies.questionFindOne = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.questionFindOne = callback;
                }};
            });

            spies.responseSend = sinon.spy();
            utils.setModuleLocalVariable(questionsModule, 'Question', {findOne: spies.questionFindOne});
            questionsModule.getQuestionByID({params: {id: ID}}, {send: spies.responseSend});
        });

        it('creates a request to get a question collection', function() {
            expect(spies.questionFindOne.withArgs({_id: ID}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('responds with the question if no error occurs', function() {
                var QUESTION = 'question';
                callbacks.questionFindOne(null, QUESTION);
                expect(spies.responseSend.withArgs(QUESTION).called).to.equal(true);
            });

            it('responds with the error description if an error occurs', function() {
                var ERROR = 'error';
                callbacks.questionFindOne(ERROR);
                expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
            });
        });
    });

    describe('#createQuestions', function() {
        var QUESTIONS = ['SUCCESS', 'FAILURE'], createQuestionSpy, sendResponseSpy, statusResponseSpy,
            setStub = function(callback) {
                createQuestionSpy = sinon.spy(callback);
                utils.setModuleLocalVariable(questionsModule, 'Question', {create: createQuestionSpy});
            };

        beforeEach(function() {
            sendResponseSpy = sinon.spy();
            statusResponseSpy = sinon.spy();
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setStub(function(question, callback) {
                    callback();
                });
                questionsModule.createQuestions({body: QUESTIONS}, {send: sendResponseSpy, status: statusResponseSpy});
            });

            it('does not respond with error status', function() {
                expect(statusResponseSpy.notCalled).to.equal(true);
            });

            it('sends an empty response', function() {
                expect(sendResponseSpy.called).to.equal(true);
                expect(sendResponseSpy.args[0][0]).to.equal(undefined);
            });
        });

        describe('FAILURE CASE', function() {
            var FAILURE = 'FAILURE';

            beforeEach(function() {
                setStub(function(question, callback) {
                    callback(FAILURE);
                });
                questionsModule.createQuestions({body: QUESTIONS}, {send: sendResponseSpy, status: statusResponseSpy});
            });

            it('responds with error status', function() {
                expect(statusResponseSpy.withArgs(400).called).to.equal(true);
            });

            it('sends response with the error description', function() {
                expect(sendResponseSpy.withArgs({reason: FAILURE}).called).to.equal(true);
            });
        });

        afterEach(function() {
            QUESTIONS.forEach(function(question) {
                expect(createQuestionSpy.withArgs(question).called).to.equal(true);
            });
        });
    });

    describe('#updateQuestion', function() {
        var spies = {}, USER_ID = 'user id',
            initialize = function(hasSupervisorRole, questionSet) {
                spies.userHasRole = sinon.spy(function() {return hasSupervisorRole;});

                questionsModule.updateQuestion({
                    body: questionSet,
                    user: {hasRole: spies.userHasRole, _id: USER_ID}
                }, {
                    end: spies.endResponse,
                    send: spies.sendResponse,
                    sendStatus: spies.statusResponse,
                    status: spies.statusResponse
                });
            },
            setFindQuestionStub = function(executeQuestionQueryCallback) {
                spies.executeQuestionQuery = sinon.spy(executeQuestionQueryCallback);

                spies.findOneQuestion = sinon.spy(function() {
                    return {exec: spies.executeQuestionQuery};
                });

                utils.setModuleLocalVariable(questionsModule, 'Question', {
                    findOne: spies.findOneQuestion
                });
            };

        beforeEach(function() {
            ['sendResponse', 'endResponse', 'statusResponse'].forEach(function(spyName) {
                spies[spyName] = sinon.spy();
            });
        });

        describe('INCOMPLETE DATA CASE', function() {
            beforeEach(function() {
                initialize(false);
            });

            it('ends the connection', function() {
                expect(spies.endResponse.called).to.equal(true);
            });

            it('responds 404 status', function() {
                expect(spies.statusResponse.withArgs(404).called).to.equal(true);
            });
        });

        describe('SINGLE QUESTION CASE', function() {
            describe('FIND QUESTION FAILURE CASE', function() {
                var ERROR = 'ERROR';

                beforeEach(function() {
                    setFindQuestionStub(function(callback) {
                        callback(ERROR);
                    });

                    initialize(true, {});
                });

                it('responds with status 400', function() {
                    expect(spies.statusResponse.withArgs(400).called).to.equal(true);
                });

                it('responds with the error description', function() {
                    expect(spies.sendResponse.withArgs({reason: ERROR}).called).to.equal(true);
                });
            });

            describe('FIND QUESTION SUCCESS CASE', function() {
                var originalQuestion, questionData, ORIGINAL_QUESTION_VERSION = 1,
                    setSaveQuestionStub = function(saveQuestionCallback) {
                        spies.saveQuestion = sinon.spy(saveQuestionCallback);
                        originalQuestion.save = spies.saveQuestion;
                    };

                beforeEach(function() {
                    originalQuestion = {question_v: ORIGINAL_QUESTION_VERSION};
                    questionData = {
                        question_use: 'question_use',
                        question_order: 'question_order',
                        question_type: 'question_type',
                        question_label: 'question_use',
                        precept: 'precept',
                        component: 'question_component',
                        indicator: 'indicator',
                        dejure: 'dejure',
                        question_text: 'question_text',
                        dependant: 'dependant',
                        question_criteria: 'question_criteria',
                        question_guidance_text: 'question_guidance_text',
                        question_dependancies: 'question_dependancies',
                        comments: 'comments',
                        linkedOption: 'linkedOption'
                    };

                    setFindQuestionStub(function(callback) {
                        callback(null, originalQuestion);
                    });
                });

                describe('SAVE QUESTION SUCCESS CASE', function() {
                    beforeEach(function() {
                        setSaveQuestionStub(function(callback) {
                            callback();
                        });

                        initialize(true, questionData);
                    });

                    it('updates the question data', function() {
                        [
                            'question_use',
                            'question_order',
                            'question_type',
                            'question_label',
                            'precept',
                            'component',
                            'indicator',
                            'dejure',
                            'question_text',
                            'dependant',
                            'question_criteria',
                            'question_guidance_text',
                            'question_dependancies',
                            'comments',
                            'linkedOption'
                        ].forEach(function(field) {
                            expect(originalQuestion[field]).to.equal(questionData[field]);
                        });

                        expect(originalQuestion.question_v).to.equal(ORIGINAL_QUESTION_VERSION + 1);
                        expect(originalQuestion.component_text).to.equal('Question component');
                        expect(originalQuestion.last_modified.modified_by).to.equal(USER_ID);

                        var now = new Date().getTime();
                        var questionTimeStamp = new Date(originalQuestion.last_modified.modified_date).getTime();
                        expect(now - questionTimeStamp < 100).to.equal(true);
                    });

                    it('does not close the connection', function() {
                        expect(spies.endResponse.notCalled).to.equal(true);
                    });
                });

                it('closes the connection in case of save question failure', function() {
                    setFindQuestionStub(function(callback) {
                        callback(null, originalQuestion);
                    });

                    setSaveQuestionStub(function(callback) {
                        callback(true);
                    });

                    initialize(true, questionData);

                    expect(spies.endResponse.called).to.equal(true);
                });

                afterEach(function() {
                    expect(spies.saveQuestion.called).to.equal(true);
                });
            });
        });

        describe('MULTIPLE QUESTIONS CASE', function() {
            var QUESTION_ID = 'QUESTION ID';

            describe('FIND QUESTION FAILURE CASE', function() {
                var ERROR = 'ERROR';

                beforeEach(function() {
                    setFindQuestionStub(function(callback) {
                        callback(ERROR);
                    });

                    initialize(true, {0: {_id: QUESTION_ID}, length: 1});
                });

                it('responds with status 400', function() {
                    expect(spies.statusResponse.withArgs(400).called).to.equal(true);
                });

                it('responds with the error description', function() {
                    expect(spies.sendResponse.withArgs({reason: ERROR}).called).to.equal(true);
                });
            });

            describe('FIND QUESTION SUCCESS CASE', function() {
                var QUESTION, ORIGINAL_QUESTION_VERSION = 1, ASSESSMENTS = 'ASSESSMENTS',
                    setQuestion = function(saveQuestionCallback) {
                        spies.saveQuestion = sinon.spy(saveQuestionCallback);
                        QUESTION = {question_v: ORIGINAL_QUESTION_VERSION, save: spies.saveQuestion};
                    },
                    getInitialization = function(setQuestionCallback) {
                        return function() {
                            setQuestion(setQuestionCallback);

                            setFindQuestionStub(function(callback) {
                                callback(null, QUESTION);
                            });

                            initialize(true, {0: {_id: QUESTION_ID, assessments: ASSESSMENTS}, length: 1});
                        };
                    };

                describe('SAVE QUESTION SUCCESS CASE', function() {
                    beforeEach(getInitialization(function(callback) {
                        callback();
                    }));

                    it('increments the question version', function() {
                        expect(QUESTION.question_v).to.equal(ORIGINAL_QUESTION_VERSION + 1);
                    });

                    it('assigns assessments to the question', function() {
                        expect(QUESTION.assessments).to.equal(ASSESSMENTS);
                    });

                    it('does not close the connection', function() {
                        expect(spies.endResponse.notCalled).to.equal(true);
                    });
                });

                it('closes the connection in case of save question failure', function() {
                    getInitialization(function(callback) {
                        callback(true);
                    })();
                    expect(spies.endResponse.called).to.equal(true);
                });

                afterEach(function() {
                    expect(spies.saveQuestion.called).to.equal(true);
                });
            });

            afterEach(function() {
                expect(spies.findOneQuestion.withArgs({_id: QUESTION_ID}).called).to.equal(true);
            });
        });

        afterEach(function() {
            expect(spies.userHasRole.withArgs('supervisor').called).to.equal(true);
        });
    });

    describe('#deleteQuestion', function() {
        var sendResponseSpy, removeQuestionSpy, ERROR = 'ERROR', ID = 'ID',
            setStub = function(error) {
                removeQuestionSpy = sinon.spy(function(criteria, callback) {
                    callback(error);
                });

                utils.setModuleLocalVariable(questionsModule, 'Question', {remove: removeQuestionSpy});
                sendResponseSpy = sinon.spy();
                questionsModule.deleteQuestion({params: {id: ID}}, {send: sendResponseSpy});
            };

        it('sends the error description if an error occurs', function() {
            setStub({toString: function() {return ERROR;}});
            expect(sendResponseSpy.withArgs({reason: ERROR}).called).to.equal(true);
        });

        it('sends an empty response if no error occurs', function() {
            setStub(null);
            expect(sendResponseSpy.called).to.equal(true);
            expect(sendResponseSpy.args[0][0]).to.equal(undefined);
        });

        afterEach(function() {
            expect(removeQuestionSpy.withArgs({_id: ID}).called).to.equal(true);
        });
    });
});
