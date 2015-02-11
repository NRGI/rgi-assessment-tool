var Assessment = require('mongoose').model('Assessment');

exports.getAssessments = function(req, res) {
	var query = Assessment.find(req.query);
	query.exec(function(err, collection) {
		res.send(collection);
	});
};

exports.getUsers = function(req, res) {
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


exports.updateAssessment = function(req, res) {
	var assessmentUpdates = req.body;
	console.log(assessmentUpdates);


	if(req.user._id != assessmentUpdates.researcher_ID && req.user._id != assessmentUpdates.reviewer_ID && !req.user.hasRole('supervisor')) {
		res.status(404);
		return res.end();
	};

	Assessment.findOne({_id:assessmentUpdates._id}).exec(function(err, assessment) {
		if(err) {
			res.status(400);
			return res.send({ reason: err.toString() });
		};

		timestamp = new Date().toISOString();

		if (!(assessment.hasOwnProperty('researcher_ID'))) {
			assessment.researcher_ID = assessmentUpdates.researcher_ID;
		}
		if (!(assessment.hasOwnProperty('reviewer_ID'))) {
			assessment.reviewer_ID = assessmentUpdates.reviewer_ID;
		}
		if (!(assessment.hasOwnProperty('assignment'))) {
			assessment.assignment = {assigned_by: req.user._id, assigned_date: timestamp};
		}

		if (assessmentUpdates.hasOwnProperty('start_date')) {
			if (!(assessment.hasOwnProperty('start_date'))) {
				assessment.start_date = {started_by: assessmentUpdates.start_date.started_by, started_date: timestamp};
			}
		}
		if (assessmentUpdates.hasOwnProperty('submit_date')) {
			if (!(assessment.hasOwnProperty('submit_date'))) {
				assessment.submit_date = {submited_by: assessmentUpdates.submit_date.submited_by, submited_date: timestamp};
			}
		}
		if (assessmentUpdates.hasOwnProperty('review_date')) {
			if (!(assessment.hasOwnProperty('review_date'))) {
				assessment.review_date = {reviewed_by: assessmentUpdates.review_date.reviewed_by, reviewed_date: timestamp};
			}
		}
		if (assessmentUpdates.hasOwnProperty('approval')) {
			if (!(assessment.hasOwnProperty('approval'))) {
				assessment.approval = {approved_by: assessmentUpdates.approval.approved_by, approved_date: timestamp};
			}
		}
		
		assessment.questions_complete = assessmentUpdates.questions_complete;
		assessment.edit_control = assessmentUpdates.edit_control;
		assessment.status = assessmentUpdates.status;

		assessment.modified.push({modified_by: req.user._id, modified_date: timestamp});

		assessment.save(function(err) {
			if(err)
				return res.send({ reason: err.toString() });
		})
	});
	res.send();
};