var Assessment = require('mongoose').model('Assessment');

exports.getAssessments = function(req, res) {
	Assessment.find({}).exec(function(err, collection) {
		res.send(collection)
	});
};

exports.getAssessmentsByID = function(req, res) {
	Assessment.findOne({assessment_ID:req.params.assessment_ID}).exec(function(err, assessment) {
		res.send(assessment);
	});
};
