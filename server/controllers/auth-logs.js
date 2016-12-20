'use strict';
/* global require */

var AuthLog = require('mongoose').model('AuthLog');

exports.getNumber = function (req, res) {
    AuthLog.getNumber(req.params.user, function(error, logsNumber) {
        res.send({error: error, number: logsNumber});
    });
};

exports.list = function (req, res) {
    var itemsPerPage = isNaN(req.params.itemsPerPage) ? 20 : parseInt(req.params.itemsPerPage);
    var page = isNaN(req.params.page) ? 0 : parseInt(req.params.page);

    AuthLog.list(req.params.user, itemsPerPage, page, function(error, logs) {
        res.send({error: error, logs: logs});
    });
};

exports.getMostRecent = function (req, res) {
    AuthLog.getMostRecent(req.params.user, req.params.action, function(error, logs) {
        res.send({error: error, logs: logs});
    });
};
