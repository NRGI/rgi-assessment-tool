'use strict';

var expect = require('chai').expect,
    mongoose = require('mongoose'),
    rewire = require('rewire'),
    sinon = require('sinon');

mongoose.model('Log', mongoose.Schema({}));
var utils = require('../utils');
var logsModule = rewire(utils.getControllerPath('logs'));

describe('`logs` module', function() {
    describe('#post', function() {
        var spies = {}, LOG = 'log data';

        beforeEach(function() {
            spies.resSend = sinon.spy();
            spies.logInfo = sinon.spy();
            utils.setModuleLocalVariable(logsModule, 'log', {info: spies.logInfo});
            logsModule.post({body: {log: LOG}}, {send: spies.resSend});
        });

        it('sends an empty response', function() {
            expect(spies.resSend.called).to.equal(true);
            expect(spies.resSend.args[0][0]).to.be.undefined;
        });

        it('saves the log data', function() {
            expect(spies.logInfo.withArgs(LOG).called).to.equal(true);
        });
    });
});
