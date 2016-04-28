'use strict';

describe('rgiPatternSet', function () {
    var HUMAN_NAME_PATTERN, PASSWORD_PATTERN,
        currentPattern,
        testPattern = function(description, testedValue, expectedResult) {
            it(description, function () {
                currentPattern.test(testedValue).should.be.equal(expectedResult);
            });
        };

    beforeEach(module('app'));

    beforeEach(inject(function(_HUMAN_NAME_PATTERN_, _PASSWORD_PATTERN_) {
        HUMAN_NAME_PATTERN = _HUMAN_NAME_PATTERN_;
        PASSWORD_PATTERN = _PASSWORD_PATTERN_;
    }));

    describe('HUMAN_NAME_PATTERN', function() {
        beforeEach(function() {
            currentPattern = HUMAN_NAME_PATTERN;
        });

        testPattern('accepts alphabetical name', 'Anna', true);
        testPattern('accepts a dashed name', 'Anna-Maria', true);
        testPattern('accepts a double name', 'Anna Maria', true);
        testPattern('declines a number', 7, false);
        testPattern('declines a name with a number', 'Oliver Stone 3', false);
        testPattern('declines a name with special characters', '@lex', false);
    });

    describe('PASSWORD_PATTERN', function() {
        beforeEach(function() {
            currentPattern = PASSWORD_PATTERN;
        });

        testPattern('accepts a 8-character password with an upper-case letter, an lower-case letter, a digit and a special character', 'P@ssw0rd', true);
        testPattern('declines a password with length less than 6 characters', 'A$df1', false);
        testPattern('declines a password with length more than 8 characters', 'P@ssw0rd1', false);
        testPattern('declines a password without a special character', 'Passw0rd', false);
        testPattern('declines a password without a digit', 'P@ssword', false);
        testPattern('declines a password without an upper-case character', 'p@ssw0rd', false);
        testPattern('declines a password without a lower-case character', 'P@SSW0RD', false);
    });
});
