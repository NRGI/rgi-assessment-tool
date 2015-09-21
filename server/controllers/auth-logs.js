'use strict';
/* global require */

var AuthLog = require('mongoose').model('AuthLog');

exports.getNumber = function (req, res) {
    AuthLog.getNumber(req.params.user, function(error, logsNumber) {
        res.send({error: error, number: logsNumber});
    });
};

exports.list = function (req, res) {
    AuthLog.list(req.params.user, req.params.itemsPerPage, req.params.page, function(error, logs) {
        res.send({error: error, logs: logs});
    });
};
