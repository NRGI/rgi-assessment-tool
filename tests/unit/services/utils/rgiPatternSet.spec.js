'use strict';

describe('rgiPatternSet', function () {
    var HUMAN_NAME_PATTERN,
        testValue = function(value, expectedResult) {
            return HUMAN_NAME_PATTERN.test(value).should.be.equal(expectedResult);
        };

    beforeEach(module('app'));

    beforeEach(inject(function(_HUMAN_NAME_PATTERN_) {
        HUMAN_NAME_PATTERN = _HUMAN_NAME_PATTERN_;
    }));

    describe('HUMAN_NAME_PATTERN', function() {
        it('accepts alphabetical name', function () {
            testValue('Anna', true);
        });

        it('accepts a dashed name', function () {
            testValue('Anna-Maria', true);
        });

        it('accepts a double name', function () {
            testValue('Anna Maria', true);
        });

        it('declines a number', function () {
            testValue(7, false);
        });

        it('declines a name with a number', function () {
            testValue('Oliver Stone 3', false);
        });

        it('declines a name with special characters', function () {
            testValue('@lex', false);
        });
    });
});
