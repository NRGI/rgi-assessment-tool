var express 	= require('express'),
	mongoose 	= require('mongoose');

// CONFIG
var env 	= process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app 	= express();

// Confguration files
var config 	= require('./server/config/config')[env];
console.log(config.port);
require('./server/config/express')(app,config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app);

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');