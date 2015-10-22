'use strict';
/*jshint -W079 */

var inject, describe, beforeEach, afterEach, it, expect;

describe('addSpaces FILTER', function () {
    beforeEach(module('app'));
    var $filter;

    beforeEach(inject(
        function (_$filter_) {
            $filter = _$filter_;
        }
    ));

    it('add spaces to words containing _', function () {
        $filter('addSpaces')('no_space').should.be.equal('no space');
    });
});
