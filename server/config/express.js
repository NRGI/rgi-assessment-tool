var express 	= require('express'),
	stylus 		= require('stylus'),
	logger 		= require('morgan'),
	bodyParser 	= require('body-parser');


module.exports = function(app, config) {
	// function for use by stylus middleware
	function compile (str, path) {
		return stylus(str).set('filename', path);
	}
	// set up view engine
	app.set('views', config.rootPath + '/server/views');
	app.set('view engine', 'jade');
	// set up logger
	app.use(logger('dev'));
	// set up body parser
	app.use(bodyParser());
	// stylus middleware implementation - routes to anything in public directory
	app.use(stylus.middleware(
		{
			src: config.rootPath + '/public',
			compile: compile
		}
	));
	app.use(express.static(config.rootPath + '/public'));
}