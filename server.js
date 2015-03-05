var express       = require('express');

var env           = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app           = express();

var config        = require('./server/config/config')[env];

var user          = process.env.USER_ID;

var pass          = process.env.USER_KEY;

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config, user, pass);

require('./server/config/passport')();

require('./server/config/routes')(app);

app.listen(config.port);

console.log('Listening on port ' + config.port + '...');