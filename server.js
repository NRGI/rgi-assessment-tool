var express      = require('express');

// var oauth2lib    = require('oauth20-provider');

var env          = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app          = express();

var config       = require('./server/config/config')[env];

var mongo_user   = process.env.USER_ID;
var mongo_pass   = process.env.USER_KEY;

var mendeley_id  = process.env.CLIENT_ID;
var mendeley_key = process.env.CLIENT_SECRET;


require('./server/config/express')(app, config, mendeley_id, mendeley_key);

require('./server/config/mongoose')(config, mongo_user, mongo_pass);

require('./server/config/passport')();

require('./server/config/routes')(app);


app.listen(config.port);
console.log('Listening on port ' + config.port + '...');