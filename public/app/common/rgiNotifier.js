/*global angular */
'use strict';

angular.module('app').value('rgiToastr', toastr);

var app = angular.module('app').factory('rgiNotifier', function (rgiToastr) {
    return {
        notify: function (msg) {
            rgiToastr.success(msg);
            console.log(msg);
        },
        error: function (msg) {
            rgiToastr.error(msg);
            console.log(msg);
        }
    };
});