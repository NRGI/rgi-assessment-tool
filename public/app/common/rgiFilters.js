'use strict';

angular.module('app')
    .filter('addSpaces', function () {
        return function (text) {
            if (text !== undefined) {
                return text.replace(/[_]/g, ' ');
            }
        };
    })
    .filter('role', function () {
        return function (role) {
            return role === undefined ? undefined : role.replace('ext_', 'external ');
        };
    })
    .filter('readableId', function () {
        return function (role) {
            return role === undefined ? undefined : role.split('_').join(' ');
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
    })
;