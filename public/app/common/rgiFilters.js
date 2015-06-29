'use strict';
//var angular;

// Angular replace filter
angular.module('app')
    .filter('addSpaces', function () {
        return function (text) {
            if (text !== undefined) {
                return text.replace(/[_]/g, ' ');
            }
        };
    })
    .filter('zpad', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = '' + num;
            while (num.length < len) {
                num = '0' + num;
            }
            return num;
        };
    });
