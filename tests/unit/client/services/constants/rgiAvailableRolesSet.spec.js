'use strict';

describe('rgiPatternSet', function () {
    var ASSESSMENT_ROLES_SET, AVAILABLE_ROLES_SET;

    beforeEach(module('app'));

    beforeEach(inject(function(_ASSESSMENT_ROLES_SET_, _AVAILABLE_ROLES_SET_) {
        ASSESSMENT_ROLES_SET = _ASSESSMENT_ROLES_SET_;
        AVAILABLE_ROLES_SET = _AVAILABLE_ROLES_SET_;
    }));

    describe('ASSESSMENT_ROLES_SET', function() {
        it('includes all available roles in the app', function() {
            ASSESSMENT_ROLES_SET.should.deep.equal(['researcher', 'reviewer', 'ext_reviewer']);
        });
    });

    describe('AVAILABLE_ROLES_SET', function() {
        it('includes all available roles in the app', function() {
            AVAILABLE_ROLES_SET.should.deep.equal(['supervisor', 'researcher', 'reviewer', 'ext_reviewer']);
        });
    });
});
