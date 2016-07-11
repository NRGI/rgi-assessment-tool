'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');

var utils = require('../utils');

utils.stubModel();
    var resourcesModule = rewire(utils.getControllerPath('resources'));
utils.restoreModel();

describe('`resources` module', function() {
    var callbacks = {}, spies = {};

    beforeEach(function() {
        spies.responseSend = sinon.spy();
    });

    describe('#getResources', function() {
        var QUERY = 'query', RESOURCES = 'resources';

        beforeEach(function() {
            spies.resourceExec = sinon.spy(function(callback) {
                callback(true, RESOURCES);
            });

            spies.resourceSort = sinon.spy(function() {
                return {exec: spies.resourceExec};
            });

            spies.resourceFind = sinon.spy(function() {
                return {sort: spies.resourceSort};
            });

            utils.setModuleLocalVariable(resourcesModule, 'Resource', {find: spies.resourceFind});
            resourcesModule.getResources({query: QUERY}, {send: spies.responseSend});
        });

        it('searches resources using the provided criteria', function() {
            expect(spies.resourceFind.withArgs(QUERY).called).to.equal(true);
        });

        it('sorts the resources', function() {
            expect(spies.resourceSort.withArgs('order').called).to.equal(true);
        });

        it('responds with the found resources', function() {
            expect(spies.responseSend.withArgs(RESOURCES).called).to.equal(true);
        });
    });

    describe('#getResourceByID', function() {
        var RESOURCE_ID = 'resource id', RESOURCE = 'resource';

        beforeEach(function() {
            spies.resourceFindOne = sinon.spy(function() {
                return {exec: function(callback) {
                    callback(true, RESOURCE);
                }};
            });

            utils.setModuleLocalVariable(resourcesModule, 'Resource', {findOne: spies.resourceFindOne});
            resourcesModule.getResourceByID({params: {id: RESOURCE_ID}}, {send: spies.responseSend});
        });

        it('submits a request to get a resource data by its id', function() {
            expect(spies.resourceFindOne.withArgs({_id: RESOURCE_ID}).called).to.equal(true);
        });

        it('responds with the the resource data', function() {
            expect(spies.responseSend.withArgs(RESOURCE).called).to.equal(true);
        });
    });

    describe('#createResource', function() {
        var BODY = 'body';

        beforeEach(function() {
            spies.resourceCreate = sinon.spy(function(criteria, callback) {
                callbacks.resourceCreate = callback;
            });

            spies.responseStatus = sinon.spy();
            utils.setModuleLocalVariable(resourcesModule, 'Resource', {create: spies.resourceCreate});
            resourcesModule.createResource({body: BODY}, {send: spies.responseSend, status: spies.responseStatus});
        });

        it('submits a request to create a resource', function() {
            expect(spies.resourceCreate.withArgs(BODY).called).to.equal(true);
        });

        describe('CALLBACK', function() {
            describe('ERROR CASE', function() {
                it('responds with the regular error description', function() {
                    var ERROR = 'error';
                    callbacks.resourceCreate(ERROR);
                    expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(true);
                });

                it('responds with a special error description if email is duplicated', function() {
                    callbacks.resourceCreate('error E11000');
                    expect(spies.responseSend.withArgs({reason: new Error('Duplicate email').toString()}).called)
                        .to.equal(true);
                });

                afterEach(function() {
                    expect(spies.responseStatus.withArgs(400).called).to.equal(true);
                });
            });

            it('responds with an empty response if no error occurs', function() {
                callbacks.resourceCreate(false);
                expect(spies.responseSend.called).to.equal(true);
                expect(spies.responseSend.args[0][0]).to.equal(undefined);
            });
        });
    });

    describe('SUPERVISOR METHODS', function() {
        var
            setAuthorized = function(authorized) {
                spies.userHasRole = sinon.spy(function() {
                    return authorized;
                });
            },
            checkUnauthorizedCase = function(method, req) {
                describe('UNAUTHORIZED CASE', function() {
                    beforeEach(function() {
                        spies.responseEnd = sinon.spy();
                        spies.responseStatus = sinon.spy();
                        setAuthorized(false);
                        req.user = {hasRole: spies.userHasRole};
                        resourcesModule[method](req, {end: spies.responseEnd, status: spies.responseStatus});
                    });

                    it('responds with 404 status code', function() {
                        expect(spies.responseStatus.withArgs(404).called).to.equal(true);
                    });

                    it('closes the connection', function() {
                        expect(spies.responseEnd.called).to.equal(true);
                    });
                });

            };

        describe('#deleteResource', function() {
            checkUnauthorizedCase('deleteResource', {});

            describe('AUTHORIZED CASE', function() {
                var RESOURCE_ID = 'resource id';

                beforeEach(function() {
                    spies.resourceRemove = sinon.spy(function(criteria, callback) {
                        callbacks.resourceRemove = callback;
                    });

                    utils.setModuleLocalVariable(resourcesModule, 'Resource', {remove: spies.resourceRemove});
                    setAuthorized(true);

                    resourcesModule.deleteResource({params: {id: RESOURCE_ID}, user: {hasRole: spies.userHasRole}},
                        {send: spies.responseSend});
                });

                it('submits a request to remove a resource by its id', function() {
                    expect(spies.resourceRemove.withArgs({_id: RESOURCE_ID}).called).to.equal(true);
                });

                describe('REMOVE RESOURCE CALLBACK', function() {
                    it('responds with the error description if an error occurs', function() {
                        var ERROR = 'error';
                        callbacks.resourceRemove(ERROR);
                        expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(true);
                    });

                    it('responds with an empty response if no errors occur', function() {
                        callbacks.resourceRemove(null);
                        expect(spies.responseSend.called).to.equal(true);
                        expect(spies.responseSend.args[0][0]).to.equal(undefined);
                    });
                });
            });
        });

        describe('#updateResource', function() {
            checkUnauthorizedCase('updateResource', {});

            describe('AUTHORIZED CASE', function() {
                var RESOURCE_DATA = {};

                beforeEach(function() {
                    spies.resourceFindOne = sinon.spy(function() {
                        return {exec: function(callback) {
                            callbacks.resourceFindOne = callback;
                        }};
                    });

                    ['_id', 'head', 'body', 'order'].forEach(function(field) {
                        RESOURCE_DATA[field] = 'resource ' + field.replace('_', '');
                    });

                    utils.setModuleLocalVariable(resourcesModule, 'Resource', {findOne: spies.resourceFindOne});
                    setAuthorized(true);
                    spies.responseStatus = sinon.spy();

                    resourcesModule.updateResource({body: RESOURCE_DATA, user: {hasRole: spies.userHasRole}},
                        {send: spies.responseSend, status: spies.responseStatus});
                });

                it('submits a request to get the resource data by its id', function() {
                    expect(spies.resourceFindOne.withArgs({_id: RESOURCE_DATA._id}).called).to.equal(true);
                });

                describe('RESOURCE FIND ONE CALLBACK', function() {
                    var checkErrorCallback = function(description, callbackName, expectedResult, error) {
                        describe(description, function() {
                            var ERROR = 'error';

                            beforeEach(function() {
                                callbacks[callbackName](error !== undefined ? error : ERROR);
                            });

                            it('responds with 400 status code', function() {
                                expect(spies.responseStatus.withArgs(400).called).to.equal(expectedResult);
                            });

                            it('responds with the error description', function() {
                                expect(spies.responseSend.withArgs({reason: ERROR}).called).to.equal(expectedResult);
                            });
                        });
                    };

                    checkErrorCallback('ERROR CASE', 'resourceFindOne', true);

                    describe('SUCCESS CASE', function() {
                        var RESOURCE = {};

                        beforeEach(function() {
                            RESOURCE.save = sinon.spy(function(callback) {
                                callbacks.resourceSave = callback;
                            });

                            callbacks.resourceFindOne(null, RESOURCE);
                        });

                        it('updates the resource data', function() {
                            ['head', 'body', 'order'].forEach(function(field) {
                                expect(RESOURCE[field]).to.equal(RESOURCE_DATA[field]);
                            });
                        });

                        it('submits a request to save the resource data', function() {
                            expect(RESOURCE.save.called).to.equal(true);
                        });

                        describe('SAVE RESOURCE CALLBACK', function() {
                            checkErrorCallback('ERROR CASE', 'resourceSave', true);
                            checkErrorCallback('SUCCESS CASE', 'resourceSave', false, null);
                        });
                    });
                });
            });
        });

        afterEach(function() {
            expect(spies.userHasRole.withArgs('supervisor').called).to.equal(true);
        });
    });
});
