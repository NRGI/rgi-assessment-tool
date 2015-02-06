var Answer = require('mongoose').model('Answer'),
	upload = require('../utilities/s3');

exports.getAnswers = function(req, res) {
	var query = Answer.find(req.query);

	query.exec(function(err, collection) {
		res.send(collection)
	});
};

exports.getAnswersByID = function(req, res) {
	Answer.findOne({answer_ID:req.params.answer_ID}).exec(function(err, answer) {
		res.send(answer);
	});
};

exports.createAnswers = function(req, res, next) {
	var newAnswers = req.body;
	for (var i = 0; i < newAnswers.length; i++) {
		newAnswers[i].assigned = {assignedBy: req.user._id};
		newAnswers[i].modified = [{modifiedBy: req.user._id}];

		Answer.create(newAnswers[i], function(err, answer) {
			if(err) {
				res.status(400)
				return res.send({reason:err.toString()})
			}
		});
	};
	res.send();
};