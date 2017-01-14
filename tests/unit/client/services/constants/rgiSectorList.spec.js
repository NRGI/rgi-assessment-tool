'use strict';

describe('rgiPatternSet', function () {
    var SECTOR_LIST;

    beforeEach(module('app'));

    beforeEach(inject(function(_SECTOR_LIST_) {
        SECTOR_LIST = _SECTOR_LIST_;
    }));

    describe('AVAILABLE_ROLES_SET', function() {
        it('includes all available sectors', function() {
            SECTOR_LIST.should.deep.equal(['pilot','hydrocarbons', 'mining', 'oil and gas']);
        });
    });
});
