'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');


var utils = require('../utils');

utils.stubModel();
    var authLogsModule = rewire(utils.getControllerPath('auth-logs'));
utils.restoreModel();

describe('`auth-logs` module', function() {
    var spies = {}, ERROR = 'error', USER = 'user',
        initialize = function(methodName, spyName, result) {
            spies[spyName] = sinon.spy(function() {
                var callback = arguments[arguments.length - 1];
                callback(ERROR, result);
            });

            var AuthLog = {};
            AuthLog[methodName] = spies[spyName];

            spies.respondSend = sinon.spy();
            utils.setModuleLocalVariable(authLogsModule, 'AuthLog', AuthLog);
        };

    describe('#getNumber', function() {
        var LOGS_NUMBER = 'number of logs';

        beforeEach(function() {
            initialize('getNumber', 'authLogGetNumber', LOGS_NUMBER);
            authLogsModule.getNumber({params: {user: USER}}, {send: spies.respondSend});
        });

        it('gets the logs data by user', function() {
            expect(spies.authLogGetNumber.withArgs(USER).called).to.equal(true);
        });

        it('sends response with error and logs number', function() {
            expect(spies.respondSend.withArgs({error: ERROR, number: LOGS_NUMBER}).called).to.equal(true);
        });
    });

    describe('#list', function() {
        var LOGS = 'logs', ITEMS_PER_PAGE = 50, PAGE = 1, ITEMS_PER_PAGE_STRING = '50', PAGE_STRING = '1';

        beforeEach(function() {
            initialize('list', 'authLogList', LOGS);
            authLogsModule.list({params: {user: USER, itemsPerPage: ITEMS_PER_PAGE_STRING, page: PAGE_STRING}},
                {send: spies.respondSend});
        });

        it('gets the logs data by submitted criteria', function() {
            expect(spies.authLogList.withArgs(USER, ITEMS_PER_PAGE, PAGE).called).to.equal(true);
        });

        it('sends response with error and logs', function() {
            expect(spies.respondSend.withArgs({error: ERROR, logs: LOGS}).called).to.equal(true);
        });
    });

    describe('#getMostRecent', function() {
        var LOGS = 'logs', ACTION = 'action';

        beforeEach(function() {
            initialize('getMostRecent', 'authLogGetMostRecent', LOGS);
            authLogsModule.getMostRecent({params: {user: USER, action: ACTION}}, {send: spies.respondSend});
        });

        it('gets the logs data by submitted criteria', function() {
            expect(spies.authLogGetMostRecent.withArgs(USER, ACTION).called).to.equal(true);
        });

        it('sends response with error and logs', function() {
            expect(spies.respondSend.withArgs({error: ERROR, logs: LOGS}).called).to.equal(true);
        });
    });
});
