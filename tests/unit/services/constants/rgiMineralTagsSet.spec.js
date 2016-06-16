'use strict';

describe('rgiPatternSet', function () {
    var MINERAL_TAGS_SET;

    beforeEach(module('app'));

    beforeEach(inject(function(_MINERAL_TAGS_SET_) {
        MINERAL_TAGS_SET = _MINERAL_TAGS_SET_;
    }));

    describe('MINERAL_TAGS_SET', function() {
        it('includes all available mineral tags in the app', function() {
            MINERAL_TAGS_SET.should.deep.equal([
                'Bauxite',
                'Copper',
                'Diamond',
                'Gold',
                'Iron ore',
                'Nickel',
                'Phosphate -Precious stones (Jade)',
                'Uranium'
            ]);
        });
    });
});
