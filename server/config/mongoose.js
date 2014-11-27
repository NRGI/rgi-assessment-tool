var mongoose 		= require('mongoose')
	userModel 		= require('../models/User'),
	questionModel 	= require('../models/Question'),
	assessmentModel = require('../models/Assessment');

module.exports 	= function(config) {
	// connect to mongodb
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console,'connection error...'));
	db.once('open', function callback() {
		console.log('rgi2015 db opened');
	});

	userModel.createDefaultUsers();
	questionModel.createDefaultQuestions();
	assessmentModel.createDefaultAssessments();
}