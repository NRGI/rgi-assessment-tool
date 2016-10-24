'use strict';

var winston = require('winston');
require('winston-papertrail');

var winstonPapertrail = new winston.transports.Papertrail({
    host: 'logs4.papertrailapp.com',
    port: 43843
});

winstonPapertrail.on('error', function(err) {
    winston.log('Unable to connect logs4.papertrailapp.com on the port 43843');
    winston.log('The error is ' + err);
});

var logger = new (winston.Logger)({
    transports: [
        winstonPapertrail
    ]
});

var concatenateErrorMessages = function(errors) {
    var errorMessages = [];

    for(var errorIndex = 0; errorIndex < errors.length; errorIndex++) {
        errorMessages.push(errors[errorIndex]);
    }

    return errorMessages.join(' ');
};

var getLoggerHandler = function(log, type) {
    return function() {
        log[type](concatenateErrorMessages(arguments));
    };
};

module.exports = {
    error: getLoggerHandler(logger, 'error'),
    info: getLoggerHandler(logger, 'info'),
    log: getLoggerHandler(logger, 'log'),
    warn: getLoggerHandler(logger, 'warn')
};
