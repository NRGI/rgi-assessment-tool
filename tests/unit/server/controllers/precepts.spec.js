'use strict';

var expect = require('chai').expect,
    sinon = require('sinon');

var utils = require('../utils');
var preceptsModule = require(utils.getControllerPath('precepts'));

describe('`precepts` module', function() {
    describe('#list', function() {
        it('responds with a static precept list', function() {
            var resSendSpy = sinon.spy();
            preceptsModule.list(null, {send: resSendSpy});

            expect(resSendSpy.withArgs([
                {value: 1, text: 'Precept 1: Strategy, consultation and institutions'},
                {value: 2, text: 'Precept 2: Accountability and transparency'},
                {value: 3, text: 'Precept 3: Exploration and license allocation'},
                {value: 4, text: 'Precept 4: Taxation'},
                {value: 5, text: 'Precept 5: Local effects'},
                {value: 6, text: 'Precept 6: State-owned enterprise'},
                {value: 7, text: 'Precept 7: Revenue distribution'},
                {value: 8, text: 'Precept 8: Revenue volatility'},
                {value: 9, text: 'Precept 9: Government spending'},
                {value: 10, text: 'Precept 10: Private sector development'},
                {value: 11, text: 'Precept 11: Roles of international companies'},
                {value: 12, text: 'Precept 12: Roles of international actors'}
            ]).called).to.equal(true);
        });
    });
});
