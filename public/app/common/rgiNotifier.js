angular.module('app').value('rgiToastr', toastr);

angular.module('app').factory('rgiNotifier', function (rgiToastr) {
    'use strict';
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