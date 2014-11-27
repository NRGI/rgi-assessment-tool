var Assessment = require('mongoose').model('Assessment');

exports.getAssessments = function(req, res) {
	Assessment.find({}).exec(function(err, collection) {
		res.send(collection)
	});
}
