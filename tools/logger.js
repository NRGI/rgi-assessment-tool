'use strict';

exports.initialize = function() {
    console.log = function() {};
    console.error = function() {};
};

exports.log = console.log;
