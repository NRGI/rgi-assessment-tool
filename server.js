var express 	= require('express'),
	stylus 		= require('stylus'),
	logger 		= require('morgan'),
	bodyParser 	= require('body-parser')
	mongoose 	= require ('mongoose');

// CONFIG
var env 	= process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app 	= express();
// function for use by stylus middleware
function compile (str, path) {
	return stylus(str).set('filename', path);
}
// set up view engine
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
// set up logger
app.use(logger('dev'));
// set up body parser
app.use(bodyParser());
// stylus middleware implementation - routes to anything in public directory
app.use(stylus.middleware(
	{
		src: __dirname + '/public',
		compile: compile
	}
));
app.use(express.static(__dirname + '/public'));

// connect to mongodb
mongoose.connect('mongodb://localhost/rgi2015');
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error...'));
db.once('open', function callback() {
	console.log('rgi2015 db opened');
});

// test mongoose shchema
var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc) {
	mongoMessage = messageDoc.message;
});



app.get('/partials/:partialPath', function(req, res) {
	res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req, res) {
	res.render('index', {
		mongoMessage: mongoMessage
	});
});

var port = 3030;
app.listen(port);

console.log('Listening on port ' + port + '...');