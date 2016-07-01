'use strict';

exports.respondError = function(err, res) {
    res.status(400);
    return res.send({ reason: err.toString() });
};

exports.respondStatus = function(statusCode, res) {
    res.sendStatus(statusCode);
    return res.end();
};

exports.submit = function(req, res) {
    if (req.status !== undefined) {
        return exports.respondStatus(req.status, res);
    } else if (req.error !== undefined) {
        res.send({reason: req.error.toString()});
        return res.end();
    } else {
        res.send(req.result);
    }
};
