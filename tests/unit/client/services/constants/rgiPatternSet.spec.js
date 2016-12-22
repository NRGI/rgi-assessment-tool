'use strict';

describe('rgiPatternSet', function () {
    var HUMAN_NAME_PATTERN, NUMERIC_RANGE_PATTERN, PASSWORD_PATTERN, VERSION_PATTERN, YEAR_PATTERN,
        currentPattern,
        testPattern = function(description, testedValue, expectedResult) {
            it(description, function () {
                currentPattern.test(testedValue).should.be.equal(expectedResult);
            });
        };

    beforeEach(module('app'));

    beforeEach(inject(function(
        _HUMAN_NAME_PATTERN_,
        _NUMERIC_RANGE_PATTERN_,
        _PASSWORD_PATTERN_,
        _VERSION_PATTERN_,
        _YEAR_PATTERN_
    ) {
        HUMAN_NAME_PATTERN = _HUMAN_NAME_PATTERN_;
        NUMERIC_RANGE_PATTERN = _NUMERIC_RANGE_PATTERN_;
        PASSWORD_PATTERN = _PASSWORD_PATTERN_;
        VERSION_PATTERN = _VERSION_PATTERN_;
        YEAR_PATTERN = _YEAR_PATTERN_;
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

    describe('NUMERIC_RANGE_PATTERN', function() {
        beforeEach(function() {
            currentPattern = NUMERIC_RANGE_PATTERN;
        });

        testPattern('accepts a single digit', '1', true);
        testPattern('rejects non-digital characters', 'word', false);
        testPattern('accepts an arbitrary positive number', '123', true);
        testPattern('declines a negative number', '-3', false);
        testPattern('accepts a dash-separated range', '7-8', true);
        testPattern('accepts a dash-separated range with a space before the dash', '7 -8', true);
        testPattern('accepts a dash-separated range with spaces before and after the dash', '7 - 8', true);
        testPattern('accepts a dash-separated range with a space after the dash', '7- 8', true);
        testPattern('accepts a dash and comma -separated range', '7-10, 14', true);
        testPattern('accepts two dash -separated ranges', '7-10, 11-14', true);
        testPattern('accepts a comma-separated range', '7,10, 14', true);
    });

    describe('PASSWORD_PATTERN', function() {
        beforeEach(function() {
            currentPattern = PASSWORD_PATTERN;
        });

        testPattern('accepts a 8-character password with an upper-case letter, an lower-case letter, a digit and a special character', 'P@ssw0rd', true);
        testPattern('accepts a 16-character password with an upper-case letter, an lower-case letter, a digit and a special character', 'P@ssw0rd12345678', true);
        testPattern('declines a password with length less than 8 characters', 'P@ssw0r', false);
        testPattern('declines a password with length more than 16 characters', 'P@ssw0rd123456789', false);
        testPattern('declines a password without a special character', 'Passw0rd', false);
        testPattern('declines a password without a digit', 'P@ssword', false);
        testPattern('declines a password without an upper-case character', 'p@ssw0rd', false);
        testPattern('declines a password without a lower-case character', 'P@SSW0RD', false);
    });

    describe('VERSION_PATTERN', function() {
        beforeEach(function() {
            currentPattern = VERSION_PATTERN;
        });

        testPattern('declines a string containing an alphabetical character', 'v1', false);
        testPattern('declines a string containing a special character (not a dot)', '#1', false);
        testPattern('declines a string without a leading version number', '.1', false);
        testPattern('approves a string with a leading version number only', '1', true);
        testPattern('approves a string with a leading version number and sub-version number', '1.1', true);
        testPattern('approves a string with multiple subversion numbers', '1.1.2', true);
        testPattern('declines a string with a alphabetical character in a sub-subversion number', '1.1.2b', false);
    });

    describe('YEAR_PATTERN', function() {
        beforeEach(function() {
            currentPattern = YEAR_PATTERN;
        });

        testPattern('accepts 4 digits only', '2016', true);
        testPattern('declines any non-digital characters', '12A4', false);
        testPattern('declines digital sequences with length shorter than 4 characters', '123', false);
        testPattern('declines digital sequences with length longer than 4 characters', '12345', false);
    });
});
