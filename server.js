'use strict';

require('newrelic');

var express         = require('express');
var env             = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app             = express();
var config          = require('./server/config/config')[env];

var logger = require('./server/logger/logger');
var user = process.env.DB_ID;
var pass = process.env.DB_KEY;

require('./server/config/express')(app, config, user, pass, env);
require('./server/config/passport')();
require('./server/config/routes')(app);

app.listen(config.port);
logger.log('Listening on port ' + config.port + '...');
