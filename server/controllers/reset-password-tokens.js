'use strict';
/*jslint nomen: true unparam: true*/

var ResetPasswordToken = require('mongoose').model('ResetPasswordToken');

exports.create = function (req, res, next) {
    ResetPasswordToken.createByUser(req.body.user, function(error, token) {
        if(error) next(error);
        console.log(token);
        res.send(token);
    });
};
