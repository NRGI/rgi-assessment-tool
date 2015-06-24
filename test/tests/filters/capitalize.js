'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, afterEach, it, expect;

describe('capitalize FILTER', function () {
    beforeEach(module('app'));
    var $filter;

    beforeEach(inject(
        function (_$filter_) {
            $filter = _$filter_;
        }
    ));

    it('capitalizes lower case word', function () {
        $filter('capitalize')('alex').should.be.equal('Alex');
    });

    it('capitalizes a phrase', function () {
        $filter('capitalize')('camel case').should.be.equal('Camel Case');
    });

    it('capitalizes upper case word', function () {
        $filter('capitalize')('USA').should.be.equal('Usa');
    });
});