'use strict';

if (env === 'production' || env === 'pilot') {
    require('newrelic');
 }


var express         = require('express');

var env             = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// var env             = 'development';

var app             = express();

var config          = require('./server/config/config')[env];

var user = process.env.DB_ID;
var pass = process.env.DB_KEY;

// if (env === 'development' || env === 'local') {
//     var user = process.env.USER_DEV_ID;
//     var pass = process.env.USER_DEV_KEY;
// } else if (env === 'production' || env === 'pilot') {
//     var user = process.env.USER_PROD_ID;
//     var pass = process.env.USER_PROD_KEY;
// }

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config, user, pass, env);

require('./server/config/passport')();

require('./server/config/routes')(app);

app.listen(config.port);
// app.listen(3030);
console.log('Listening on port ' + config.port + '...');
