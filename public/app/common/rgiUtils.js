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
    .filter('numberFixedLen', function () {
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
//.filter('zpad', function() {
//    return function(input, n) {
//        //return String(input).length;
//        //return n;
//        if (input=== undefined) {
//            input = "";
//        }
//        if (String(input).length >= n) {
//            return input;
//        } else {
//            var zeros = 'abc'.repeat(1);
//            return zeros;
//        }
//        //if(input === undefined)
//        //    input = ""
//        //if(input.length >= n)
//        //    return input
//        //var zeros = "0".repeat(n);
//        //return (zeros + input).slice(-1 * n)
//    };
//});
