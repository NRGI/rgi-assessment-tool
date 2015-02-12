var Assessment = require('mongoose').model('Assessment');

exports.getAssessments = function (req, res) {
    var query = Assessment.find(req.query);
    query.exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getAssessmentsByID = function (req, res) {
    Assessment.findOne({assessment_ID: req.params.assessment_ID}).exec(function (err, assessment) {
        res.send(assessment);
    });
};


exports.updateAssessment = function (req, res) {
    var assessmentUpdates = req.body;


    if (req.user._id != assessmentUpdates.researcher_ID && req.user._id != assessmentUpdates.reviewer_ID && !req.user.hasRole('supervisor')) {
        console.log("NNOOOOOOOOOOO!!!@!!");
        res.status(404);
        return res.end();
    }

    Assessment.findOne({_id: assessmentUpdates._id}).exec(function (err, assessment) {
        var timestamp = new Date().toISOString();
        // console.log(assessment);

        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        if (!('researcher_ID' in assessment)) {
            assessment.researcher_ID = assessmentUpdates.researcher_ID;
        }
        if (!('reviewer_ID' in assessment)) {
            assessment.reviewer_ID = assessmentUpdates.reviewer_ID;
        }
        if ('assignment' in assessmentUpdates) {
            if (!('assignment' in assessment)) {
                assessment.assignment = assessmentUpdates.assignment;
            }
        }
        if ('start_date' in assessmentUpdates) {
            if (assessment.start_date.started_by === undefined) {
                assessment.start_date = {started_by: assessmentUpdates.start_date.started_by, started_date: timestamp};
            }
        }
        if ('submit_date' in assessmentUpdates) {
            if (assessment.submit_date.submited_by === undefined) {
                assessment.submit_date = {submited_by: assessmentUpdates.submit_date.submited_by, submited_date: timestamp};
            }
        }
        if ('review_date' in assessmentUpdates) {
            if (assessment.review_date.reviewed_by === undefined) {
                assessment.review_date = {reviewed_by: assessmentUpdates.review_date.reviewed_by, reviewed_date: timestamp};
            }
        }
        if ('approval' in assessmentUpdates) {
            if (assessment.approval.approved_by === undefined) {
                assessment.approval = {approved_by: assessmentUpdates.approval.approved_by, approved_date: timestamp};
            }
        }
        assessment.questions_complete = assessmentUpdates.questions_complete;
        assessment.edit_control = assessmentUpdates.edit_control;
        assessment.status = assessmentUpdates.status;

        assessment.modified.push({modified_by: req.user._id, modified_date: timestamp});
// 
        assessment.save(function (err) {
            if (err) {
                return res.send({ reason: err.toString() });
            }
        });
    });
    res.send();
};