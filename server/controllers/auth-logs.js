'use strict';
/* global require */

var AuthLog = require('mongoose').model('AuthLog');

exports.getNumber = function (req, res) {
    AuthLog.getNumber(req.params.user, function(error, logsNumber) {
        res.send({error: error, number: logsNumber});
    });
};
