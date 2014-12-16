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

exports.updateAssessment = function(req,res) {
	console.log(req.body);

};


exports.updateAssessment = function(req, res) {
	var assessmentUpdates = req.body;

	if(!req.user.hasRole('supervisor')) {
		res.status(404);
		return res.end();
	}

	Assessment.findOne({_id:req.body._id}).exec(function(err, assessment) {
		if(err) {
			res.status(400);
			return res.send({ reason: err.toString() });
		}
		assessment.researcher_ID = assessmentUpdates.researcher_ID;
		assessment.reviewer_ID = assessmentUpdates.reviewer_ID;
		assessment.edit_control = assessmentUpdates.edit_control;
		assessment.assign_date = assessmentUpdates.assign_date;
		assessment.status = assessmentUpdates.status;
		
		if(assessment.modified) {
			assessment.modified.push({modifiedBy: req.user._id});
		}else{
			assessment.modified = {modifiedBy: req.user._id};
		}

		assessment.save(function(err) {
			if(err)
				return res.send({ reason: err.toString() });
		})
	});
	res.send();
};