'use strict';

angular.module('app')
    .value('rgiToastr', toastr);

angular.module('app')
    .factory('rgiNotifier', ['rgiLogger', 'rgiToastr', function (rgiLogger, rgiToastr) {
        return {
            notify: function (msg) {
                rgiToastr.success(msg);
                rgiLogger.log(msg);
            },
            error: function (msg) {
                rgiToastr.error(msg);
                rgiLogger.log(msg);
            }
        };
    }]);
