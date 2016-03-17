'use strict';

exports.submit = function(req, res) {
    if (req.status !== undefined) {
        res.sendStatus(req.status);
        return res.end();
    } else if (req.error !== undefined) {
        res.send({reason: req.error.toString()});
        return res.end();
    } else {
        res.send(req.result);
    }
};
