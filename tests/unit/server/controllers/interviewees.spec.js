'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');

utils.stubModel();
    var intervieweesModule = rewire(utils.getControllerPath('interviewees'));
utils.restoreModel();

describe('`interviewees` module', function() {
    var callbacks = {}, spies = {};

    beforeEach(function() {
        spies.responseSend = sinon.spy();
    });

    describe('#getInterviewees', function() {
        var QUERY = 'query';

        beforeEach(function() {
            spies.intervieweeFind = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.intervieweeFind = callback;
                }};
            });

            utils.setModuleLocalVariable(intervieweesModule, 'Interviewee', {find: spies.intervieweeFind});
            intervieweesModule.getInterviewees({query: QUERY}, {send: spies.responseSend});
        });

        it('sends a request to get interviewee list', function() {
            expect(spies.intervieweeFind.withArgs(QUERY).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('submits the error for further processing if an error occurs', function() {
                var ERROR = 'error';
                callbacks.intervieweeFind(ERROR);
                expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
            });

            it('submits a generated error for further processing if no interviewees are found', function() {
                callbacks.intervieweeFind(false, null);
                expect(spies.responseSend.withArgs({reason: new Error('No interviewees found').toString()}).called)
                    .to.equal(true);
            });

            it('responds with interviewees list if the list is not empty and got without any error', function() {
                var INTERVIEWEES = ['interviewee 1', 'interviewee 2'];
                callbacks.intervieweeFind(false, INTERVIEWEES);
                expect(spies.responseSend.withArgs(INTERVIEWEES).called).to.equal(true);
            });
        });
    });

    describe('#getIntervieweeByID', function() {
        var INTERVIEWEE_ID = 'id';

        beforeEach(function() {
            spies.intervieweeFindOne = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.intervieweeFindOne = callback;
                }};
            });

            utils.setModuleLocalVariable(intervieweesModule, 'Interviewee', {findOne: spies.intervieweeFindOne});
            intervieweesModule.getIntervieweeByID({params: {id: INTERVIEWEE_ID}}, {send: spies.responseSend});
        });

        it('sends a request to get interviewee list', function() {
            expect(spies.intervieweeFindOne.withArgs({_id: INTERVIEWEE_ID}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('submits the error for further processing if an error occurs', function() {
                var ERROR = 'error';
                callbacks.intervieweeFindOne(ERROR);
                expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
            });

            it('submits a generated error for further processing if no interviewee is found', function() {
                callbacks.intervieweeFindOne(false, null);
                expect(spies.responseSend.withArgs({reason: new Error('No interviewee found').toString()}).called)
                    .to.equal(true);
            });

            it('responds with the interviewee data if the interviewee is found and got without any error', function() {
                var INTERVIEWEE = 'interviewee';
                callbacks.intervieweeFindOne(false, INTERVIEWEE);
                expect(spies.responseSend.withArgs(INTERVIEWEE).called).to.equal(true);
            });
        });
    });

    describe('#deleteInterviewee', function() {
        var INTERVIEWEE_ID = 'interviewee id';

        beforeEach(function() {
            spies.intervieweeRemove = sinon.spy(function(criteria, callback) {
                callbacks.intervieweeRemove = callback;
            });

            utils.setModuleLocalVariable(intervieweesModule, 'Interviewee', {remove: spies.intervieweeRemove});
            intervieweesModule.deleteInterviewee({params: {id: INTERVIEWEE_ID}}, {send: spies.responseSend});
        });

        it('sends a request to remove the interviewee by its id', function() {
            expect(spies.intervieweeRemove.withArgs({_id: INTERVIEWEE_ID}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            it('responds with an empty response if no error is got', function() {
                callbacks.intervieweeRemove(false);
                expect(spies.responseSend.withArgs({}).called).to.equal(true);
            });

            it('responds with the error description if an error is got', function() {
                var ERROR = 'error';
                callbacks.intervieweeRemove(ERROR);
                expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(true);
            });
        });
    });

    describe('#createInterviewee', function() {
        var REQUEST_BODY = {field: 'value'}, USER_ID = 'user id';

        beforeEach(function() {
            spies.intervieweeCreate = sinon.spy(function(criteria, callback) {
                callbacks.intervieweeCreate = callback;
            });

            utils.setModuleLocalVariable(intervieweesModule, 'Interviewee', {create: spies.intervieweeCreate});
            spies.responseStatus = sinon.spy();

            intervieweesModule.createInterviewee({body: REQUEST_BODY, user: {_id: USER_ID}},
                {send: spies.responseSend, status: spies.responseStatus});
        });

        it('submits a request to create an interviewee', function() {
            expect(spies.intervieweeCreate.withArgs({field: 'value', createdBy: USER_ID}).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            describe('ERROR CASE', function() {
                it('responds with the error description if an error occurs', function() {
                    var ERROR = 'error';
                    callbacks.intervieweeCreate(ERROR);
                    expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(true);
                });

                it('responds with a special error if an email / phone number duplication error occurs', function() {
                    callbacks.intervieweeCreate('E11000 error');
                    var errorDescription = new Error('Duplicate email and phone number combination').toString();
                    expect(spies.responseSend.withArgs({reason: errorDescription}).called).to.equal(true);
                });

                afterEach(function() {
                    spies.responseStatus.withArgs(400);
                });
            });
        });
    });

    describe('#updateInterviewee', function() {
        var INTERVIEWEE_DATA = {}, USER_ID = 'user id';

        beforeEach(function() {
            INTERVIEWEE_DATA._id = 'interviewee id';
            INTERVIEWEE_DATA.firstName = 'interviewee first name';
            INTERVIEWEE_DATA.lastName = 'interviewee last name';
            INTERVIEWEE_DATA.email = 'interviewee email';
            INTERVIEWEE_DATA.phone = 'interviewee phone number';
            INTERVIEWEE_DATA.role = 'interviewee role';
            INTERVIEWEE_DATA.title = 'interviewee title';
            INTERVIEWEE_DATA.salutation = 'interviewee salutation';
            INTERVIEWEE_DATA.organization = 'interviewee organization';
            INTERVIEWEE_DATA.assessments = 'interviewee assessments';
            INTERVIEWEE_DATA.answers = 'interviewee answers';
            INTERVIEWEE_DATA.users = 'interviewee users';
            INTERVIEWEE_DATA.questions = 'interviewee questions';

            spies.intervieweeFindOne = sinon.spy(function() {
                return {exec: function(callback) {
                    callbacks.intervieweeFindOne = callback;
                }};
            });

            spies.responseStatus = sinon.spy();
            utils.setModuleLocalVariable(intervieweesModule, 'Interviewee', {findOne: spies.intervieweeFindOne});

            intervieweesModule.updateInterviewee({body: INTERVIEWEE_DATA, user: {_id: USER_ID}},
                {send: spies.responseSend, status: spies.responseStatus});
        });

        it('sends a request to get the interviewee by its id', function() {
            expect(spies.intervieweeFindOne.withArgs({_id: INTERVIEWEE_DATA._id}).called).to.equal(true);
        });

        describe('INTERVIEWEE FIND ONE CALLBACK', function() {
            describe('ERROR CASE', function() {
                var ERROR = 'error';

                beforeEach(function() {
                    callbacks.intervieweeFindOne(ERROR);
                });

                it('responds with status code 400', function() {
                    expect(spies.responseStatus.withArgs(400).called).to.equal(true);
                });

                it('responds with the error description', function() {
                    expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(true);
                });
            });

            describe('SUCCESS CASE', function() {
                var INTERVIEWEE;

                beforeEach(function() {
                    spies.intervieweeSave = sinon.spy(function(callback) {
                        callbacks.intervieweeSave = callback;
                    });

                    INTERVIEWEE = {save: spies.intervieweeSave, modified: []};
                    callbacks.intervieweeFindOne(false, INTERVIEWEE);
                });

                it('modifies the interviewee data', function() {
                    [
                        'firstName',
                        'lastName',
                        'email',
                        'phone',
                        'role',
                        'title',
                        'salutation',
                        'organization',
                        'assessments',
                        'answers',
                        'users',
                        'questions'
                    ].forEach(function(field) {
                        expect(INTERVIEWEE[field]).to.equal(INTERVIEWEE_DATA[field]);
                    });

                    expect(INTERVIEWEE.modified).to.deep.equal([{modifiedBy: USER_ID}]);
                });

                it('sends a request to update the interviewee data', function() {
                    expect(spies.intervieweeSave.called).to.equal(true);
                });

                describe('SAVE INTERVIEWEE CALLBACK', function() {
                    it('responds with the error description if an error occurs', function() {
                        var ERROR = 'error';
                        callbacks.intervieweeSave(ERROR);
                        expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(true);
                    });

                    it('responds with an empty response if no errors occur', function() {
                        callbacks.intervieweeSave(false);
                        expect(spies.responseSend.called).to.equal(true);
                    });
                });
            });
        });
    });

    describe('#parseCriterion', function() {
        var req;

        beforeEach(function() {
            spies.next = sinon.spy();
            req = {query: {}, params: {answers: 'itemA,itemB'}};
            intervieweesModule.parseCriterion(req, undefined, spies.next);
        });

        it('sets the parsed parameters', function() {
            expect(req.query.answer_ID).to.deep.equal({$in: ['itemA', 'itemB']});
        });

        it('calls `next` handler', function() {
            expect(spies.next.called).to.equal(true);
        });
    });
});
