'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');

utils.stubModel(['Log']);
    var assessmentsModule = rewire(utils.getControllerPath('assessments'));
utils.restoreModel();

describe('`assessments` module', function() {
    var spies = {}, callbacks = {};

    describe('#list', function() {
        beforeEach(function() {
            spies.assessmentExec = sinon.spy(function(callback) {
                callbacks.assessmentExec = callback;
            });

            spies.assessmentFind = sinon.spy(function() {
                return {exec: spies.assessmentExec};
            });

            spies.resSend = sinon.spy();
            utils.setModuleLocalVariable(assessmentsModule, 'Assessment', {find: spies.assessmentFind});
            assessmentsModule.list(null, {send: spies.resSend});
        });

        it('submits a search request', function() {
            expect(spies.assessmentFind.withArgs({deleted: {$ne: true}}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('responds with the error description if an error occurs', function() {
                var ERROR = 'error description';
                callbacks.assessmentExec(ERROR);
                expect(spies.resSend.withArgs({reason: ERROR}).called).to.equal(true);
            });

            it('responds with the assessment list if no error occurs', function() {
                var ASSESSMENTS = 'assessments list';
                callbacks.assessmentExec(null, ASSESSMENTS);
                expect(spies.resSend.withArgs(ASSESSMENTS).called).to.equal(true);
            });
        });
    });

    describe('#setNonDeletedAssessmentCriteria', function() {
        var req = {};

        beforeEach(function() {
            spies.assessmentExec = sinon.spy(function(callback) {
                callbacks.assessmentExec = callback;
            });

            spies.assessmentFind = sinon.spy(function() {
                return {exec: spies.assessmentExec};
            });

            spies.next = sinon.spy();
            utils.setModuleLocalVariable(assessmentsModule, 'Assessment', {find: spies.assessmentFind});
            assessmentsModule.setNonDeletedAssessmentCriteria(req, null, spies.next);
        });

        it('submits a search request', function() {
            expect(spies.assessmentFind.withArgs({deleted: true}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('does nothing if an error occurs', function() {
                callbacks.assessmentExec(true);
            });

            it('collects the found assessment ids', function() {
                var ASSESSMENT1_ID = 'assessment 1', ASSESSMENT2_ID = 'assessment 2';
                var ASSESSMENTS = [{assessment_ID: ASSESSMENT1_ID}, {assessment_ID: ASSESSMENT2_ID}];
                callbacks.assessmentExec(null, ASSESSMENTS);
                expect(req.deletedAssessments).to.deep.equal([ASSESSMENT1_ID, ASSESSMENT2_ID]);
            });

            afterEach(function() {
                expect(spies.next.called).to.equal(true);
                expect(spies.next.args[0][0]).to.not.exist;
            });
        });
    });

    describe('#createAssessments', function() {
        var ASSESSMENT1_ID = 'assessment1 id', ASSESSMENT2_ID = 'assessment2 id';

        beforeEach(function() {
            spies.assessmentCreate = sinon.spy(function(assessment, callback) {
                callbacks.assessmentCreate = callback;
            });

            spies.send = sinon.spy();
            spies.status = sinon.spy();

            utils.setModuleLocalVariable(assessmentsModule, 'Assessment', {create: spies.assessmentCreate});
            assessmentsModule.createAssessments({body: [ASSESSMENT1_ID, ASSESSMENT2_ID]}, spies);
        });

        it('submits requests to create assessments', function() {
            expect(spies.assessmentCreate.withArgs(ASSESSMENT1_ID).called).to.equal(true);
            expect(spies.assessmentCreate.withArgs(ASSESSMENT2_ID).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            beforeEach(function() {
                spies.send = sinon.spy();
            });

            describe('an error occurred', function() {
                it('shows the error description if a regular error occurred', function() {
                    var ERROR = 'regular error';
                    callbacks.assessmentCreate(ERROR);
                    expect(spies.send.withArgs({reason: ERROR}).called).to.equal(true);
                });

                it('shows a special error message if a `E11000` error occurred', function() {
                    callbacks.assessmentCreate('E11000 error');
                    expect(spies.send.withArgs({reason: new Error('Duplicate Assessment').toString()}).called).to.equal(true);
                });

                afterEach(function() {
                    expect(spies.status.withArgs(400).called).to.equal(true);
                });
            });

            describe('no error occurred', function() {
                it('does nothing', function() {
                    callbacks.assessmentCreate();
                    expect(spies.send.called).to.equal(false);
                    expect(spies.status.called).to.equal(false);
                });
            });
        });

        afterEach(function() {
            expect(spies.next.called).to.equal(true);
            expect(spies.next.args[0][0]).to.not.exist;
        });
    });
});
