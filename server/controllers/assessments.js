var Assessment = require('mongoose').model('Assessment');

exports.getAssessments = function(req, res) {
	var query = Assessment.find(req.query);
	query.exec(function(err, collection) {
		res.send(collection);
	});
	// Assessment.find({}).exec(function(err, collection) {
	// 	res.send(collection)
	// });
};

exports.getUsers = function(req, res) {
	// console.log(req.query);
	if(req.user.hasRole('supervisor')) {
		var query = User.find(req.query);
	}else{
		var query = User.find(req.query).select({ "firstName": 1,"lastName":1});
	}
	query.exec(function(err, collection) {
		res.send(collection);
	});
};

exports.getAssessmentsByID = function(req, res) {
	Assessment.findOne({assessment_ID:req.params.assessment_ID}).exec(function(err, assessment) {
		res.send(assessment);
	});
};

// exports.updateAssessment = function(req,res) {
// 	console.log(req.body);

// };


exports.updateAssessment = function(req, res) {
	var assessmentUpdates = req.body;


	if(req.user._id != assessmentUpdates.researcher_ID && req.user._id != assessmentUpdates.reviewer_ID && !req.user.hasRole('supervisor')) {
		res.status(404);
		return res.end();
	}

	Assessment.findOne({_id:assessmentUpdates._id}).exec(function(err, assessment) {
		if(err) {
			res.status(400);
			return res.send({ reason: err.toString() });
		}

		timestamp = new Date().toISOString();

		assessment.researcher_ID = assessmentUpdates.researcher_ID;
		assessment.reviewer_ID = assessmentUpdates.reviewer_ID;
		assessment.questions_complete = assessmentUpdates.questions_complete;
		assessment.edit_control = assessmentUpdates.edit_control;
		assessment.modified.push({modified_by: req.user._id, modified_date: timestamp});
		assessment.assignment = {assigned_by: req.user._id, assigned_date: timestamp};
		assessment.status = assessmentUpdates.status;

		assessment.save(function(err) {
			if(err)
				return res.send({ reason: err.toString() });
		})
	});
	res.send();
};