'use strict';

angular.module('app').factory('rgiLogger', ['$http', function ($http) {
    var getMessage = function(messageList) {
        var messages = [];

        for(var messageIndex = 0; messageIndex < messageList.length; messageIndex++) {
            messages.push(messageList[messageIndex]);
        }

        return messages.join(', ');
    };

    return {
        assert: console.assert,
        dir: console.dir,
        error: console.error,
        info: function() {
            $http.post('/api/logs', {log: getMessage(arguments)});
        },
        log: console.log,
        time: console.time,
        timeEnd: console.timeEnd,
        trace: console.trace,
        warn: console.warn
    };
}]);
