'use strict';

angular.module('app').factory('rgiLogger', function () {
    return {
        assert: console.assert,
        dir: console.dir,
        error: console.error,
        info: console.info,
        log: console.log,
        time: console.time,
        timeEnd: console.timeEnd,
        trace: console.trace,
        warn: console.warn
    };
});
