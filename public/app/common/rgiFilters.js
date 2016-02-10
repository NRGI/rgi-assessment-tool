'use strict';

angular.module('app')
    .filter('addSpaces', function () {
        return function (text) {
            if (text !== undefined) {
                return text.replace(/[_]/g, ' ');
            }
        };
    })
    .filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });

            if(reverse) {
                filtered.reverse();
            }

            return filtered;
        };
    })
    .filter('role', function () {
        return function (role) {
            return role === undefined ? undefined : role.replace('ext_', 'external ');
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