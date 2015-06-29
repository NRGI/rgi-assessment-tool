//TODO add test for zpad
//'use strict';
///*jslint nomen: true newcap: true */
//var describe, beforeEach, afterEach, it, expect;
//
//describe('zpad FILTER', function () {
//    beforeEach(module('app'));
//    var $filter;
//
//    beforeEach(inject(
//        function (_$filter_) {
//            $filter = _$filter_;
//        }
//    ));
//
//    it('add pads numbers with 0s', function () {
//        $filter('zpad')(2).should.be.equal('no space');
//    });
//
//    it('capitalizes a phrase', function () {
//        $filter('capitalize')('camel case').should.be.equal('Camel Case');
//    });
//
//    it('capitalizes upper case word', function () {
//        $filter('capitalize')('USA').should.be.equal('Usa');
//    });
//});


//.filter('zpad', function () {
//    return function (n, len) {
//        var num = parseInt(n, 10);
//        len = parseInt(len, 10);
//        if (isNaN(num) || isNaN(len)) {
//            return n;
//        }
//        num = '' + num;
//        while (num.length < len) {
//            num = '0' + num;
//        }
//        return num;
//    };
//});
