'use strict';

if (env === 'production' || env === 'pilot') {
    require('newrelic');
 }


var express         = require('express');

var env             = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app             = express();

var config          = require('./server/config/config')[env];

var user = process.env.DB_ID;
var pass = process.env.DB_KEY;

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config, user, pass, env);

require('./server/config/passport')();

require('./server/config/routes')(app);

app.listen(config.port);

console.log('Listening on port ' + config.port + '...');
