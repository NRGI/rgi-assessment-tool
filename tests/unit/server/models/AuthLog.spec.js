'use strict';

var expect = require('chai').expect,
    sinon = require('sinon');

var utils = require('../utils');
var AuthLog = require(utils.getModelPath('AuthLog'));

describe('`AuthLog` model', function() {
    var spies = {}, stubs = {};

    describe('#getNumber', function() {
        var LOGS_NUMBER = 'logs number', USER_ID = 'user id';

        beforeEach(function() {
            spies.count = sinon.spy(function(criteria, callback) {
                callback(LOGS_NUMBER);
            });

            stubs.count = sinon.stub(AuthLog, 'count', spies.count);
            spies.getNumberCallback = sinon.spy();
            AuthLog.getNumber(USER_ID, spies.getNumberCallback);
        });

        it('sends a request to logs number by user', function() {
            expect(spies.count.withArgs({user: USER_ID}).called).to.equal(true);
        });

        it('calls the provided callback with the logs number', function() {
            expect(spies.getNumberCallback.withArgs(LOGS_NUMBER).called).to.equal(true);
        });
    });

    describe('#getMostRecent', function() {
        var ACTION = 'action', USER_ID = 'user id';

        beforeEach(function() {
            spies.exec = sinon.spy(function(callback) {
                callback();
            });

            spies.limit = sinon.spy(function() {
                return {exec: spies.exec};
            });

            spies.sort = sinon.spy(function() {
                return {limit: spies.limit};
            });

            spies.find = sinon.spy(function() {
                return {sort: spies.sort};
            });

            stubs.find = sinon.stub(AuthLog, 'find', spies.find);
            spies.getMostRecentCallback = sinon.spy();
            AuthLog.getMostRecent(USER_ID, ACTION, spies.getMostRecentCallback);
        });

        it('sorts the results by date & time in descending order', function() {
            expect(spies.sort.withArgs({'date-time': -1}).called).to.equal(true);
        });

        it('selects the first record only', function() {
            expect(spies.limit.withArgs(1).called).to.equal(true);
        });

        it('searches the logs according to the provided criteria', function() {
            expect(spies.find.withArgs({user: USER_ID, action: ACTION}).called).to.equal(true);
        });

        it('executes the provided callback', function() {
            expect(spies.getMostRecentCallback.called).to.equal(true);
        });
    });

    describe('#getMostRecent', function() {
        var ITEMS_PER_PAGE = 10, PAGE = 1, USER_ID = 'user id';

        beforeEach(function() {
            spies.exec = sinon.spy(function(callback) {
                callback();
            });

            spies.limit = sinon.spy(function() {
                return {exec: spies.exec};
            });

            spies.skip = sinon.spy(function() {
                return {limit: spies.limit};
            });

            spies.sort = sinon.spy(function() {
                return {skip: spies.skip};
            });

            spies.find = sinon.spy(function() {
                return {sort: spies.sort};
            });

            stubs.find = sinon.stub(AuthLog, 'find', spies.find);
            spies.listCallback = sinon.spy();
            AuthLog.list(USER_ID, ITEMS_PER_PAGE, PAGE, spies.listCallback);
        });

        it('sorts the results by date & time in descending order', function() {
            expect(spies.sort.withArgs({'date-time': -1}).called).to.equal(true);
        });

        it('skips already shown records', function() {
            expect(spies.skip.withArgs(PAGE * ITEMS_PER_PAGE).called).to.equal(true);
        });

        it('selects the defined records portion only', function() {
            expect(spies.limit.withArgs(ITEMS_PER_PAGE).called).to.equal(true);
        });

        it('searches the logs according to the provided criteria', function() {
            expect(spies.find.withArgs({user: USER_ID}).called).to.equal(true);
        });

        it('executes the provided callback', function() {
            expect(spies.listCallback.called).to.equal(true);
        });
    });

    describe('#create', function() {
        var criteria, ACTION = 'action', USER_ID = 'user id';

        beforeEach(function() {
            spies.create = sinon.spy(function(actualCriteria) {
                criteria = actualCriteria;
            });

            stubs.create = sinon.stub(AuthLog, 'create', spies.create);
            AuthLog.log(USER_ID, ACTION);
        });

        it('creates a record with user id and action', function() {
            expect(criteria.action).to.equal(ACTION);
            expect(criteria.user).to.equal(USER_ID);
        });

        it('creates a record with current date & time', function() {
            expect(new Date().getTime() - criteria['date-time'].getTime() < 100).to.equal(true);
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
