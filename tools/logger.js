'use strict';

var originalLog = console.log;

exports.initialize = function() {
    console.log = function() {};
    console.error = function() {};
};

exports.log = function(message) {
    originalLog(new Date().toISOString() + ': ' + message);
};
