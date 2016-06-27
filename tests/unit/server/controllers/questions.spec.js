'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils'),
    questionsModule = rewire(utils.getControllerPath('questions'));
utils.restoreModel();

describe('`questions` module', function() {
    describe('#getQuestions', function() {
        var COLLECTION = 'COLLECTION', QUERY = 'QUERY', sendResponseSpy, findQuestionSpy, execQuerySpy,
            setStub = function(execCallback) {
                execQuerySpy = sinon.spy(execCallback);

                findQuestionSpy = sinon.spy(function() {
                    return {exec: execQuerySpy};
                });

                utils.setModuleLocalVariable(questionsModule, 'Question', {find: findQuestionSpy});
            };

        beforeEach(function() {
            sendResponseSpy = sinon.spy();

            setStub(function(callback) {
                callback(null, COLLECTION);
            });

            questionsModule.getQuestions({query: QUERY}, {send: sendResponseSpy});
        });

        it('creates a request to get a question collection', function() {
            expect(findQuestionSpy.withArgs(QUERY).called).to.equal(true);
        });

        it('sends question collection as the response', function() {
            expect(sendResponseSpy.withArgs(COLLECTION).called).to.equal(true);
        });
    });

    describe('#getQuestionsByID', function() {
        var QUESTION = 'QUESTION', ID = 'ID', sendResponseSpy, findOneQuestionSpy, execQuerySpy,
            setStub = function(execCallback) {
                execQuerySpy = sinon.spy(execCallback);

                findOneQuestionSpy = sinon.spy(function() {
                    return {exec: execQuerySpy};
                });

                utils.setModuleLocalVariable(questionsModule, 'Question', {findOne: findOneQuestionSpy});
            };

        beforeEach(function() {
            sendResponseSpy = sinon.spy();

            setStub(function(callback) {
                callback(null, QUESTION);
            });

            questionsModule.getQuestionsByID({params: {id: ID}}, {send: sendResponseSpy});
        });

        it('creates a request to get a question collection', function() {
            expect(findOneQuestionSpy.withArgs({_id: ID}).called).to.equal(true);
        });

        it('sends question collection as the response', function() {
            expect(sendResponseSpy.withArgs(QUESTION).called).to.equal(true);
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
