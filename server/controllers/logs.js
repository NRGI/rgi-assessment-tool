'use strict';

var bunyan      = require('bunyan'),
    BunyanSlack = require('bunyan-slack');

var log = bunyan.createLogger({
    name: 'client',
    streams: [
        {
            stream: new BunyanSlack({
                webhook_url: 'https://hooks.slack.com/services/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',
                channel: '#client-logs-local',
                username: 'webhookbot'
            })
        },
        {
            stream: require('bunyan-mongodb-stream')({model: require('mongoose').model('Log')})
        }
    ]
});

exports.post = function (req, res) {
    log.info(req.body.log);
    res.send();
};
