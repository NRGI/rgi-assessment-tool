'use strict';

describe('rgiPatternSet', function () {
    var AVAILABLE_ROLES_SET;

    beforeEach(module('app'));

    beforeEach(inject(function(_AVAILABLE_ROLES_SET_) {
        AVAILABLE_ROLES_SET = _AVAILABLE_ROLES_SET_;
    }));

    describe('AVAILABLE_ROLES_SET', function() {
        it('includes all available roles in the app', function() {
            AVAILABLE_ROLES_SET.should.deep.equal(['supervisor', 'researcher', 'reviewer', 'ext_reviewer']);
        });
    });
});
