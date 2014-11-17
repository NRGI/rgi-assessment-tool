var express = require('express');


var env 	= process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app 	= express();

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.get('*', function(req, res) {
	res.render('index');
});

var port = 3030;
app.listen(port);

console.log('Listening on port ' + port + '...');