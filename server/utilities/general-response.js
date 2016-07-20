'use strict';

exports.getObjectSet = function(object, method, criteria, errorMessage, res) {
    object[method](criteria).exec(function (err, objectSet) {
        if (!err && !objectSet) {
            err = new Error(errorMessage);
        }

        res.send(err ? {reason: err.toString()} : objectSet);
    });
};

exports.respondError = function(res, err, statusCode) {
    res.status(statusCode || 400);
    return res.send({reason: err.toString()});
};

exports.respondStatus = function(res, statusCode) {
    res.sendStatus(statusCode);
    return res.end();
};

exports.submit = function(req, res) {
    if (req.status !== undefined) {
        return exports.respondStatus(res, req.status);
    } else if (req.error !== undefined) {
        res.send({reason: req.error.toString()});
        return res.end();
    } else {
        res.send(req.result);
    }
};
