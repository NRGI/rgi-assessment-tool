var Answer = require('mongoose').model('Answer');

exports.getAnswers = function(req, res) {
	Answer.find({}).exec(function(err, collection) {
		res.send(collection)
	});
};

exports.createAnswers = function(req, res, next) {
	// console.log(req.body);
	var newAnswers = req.body;
	for (var i = 0; i < newAnswers.length; i++) {
		newAnswers[i].assigned = {assignedBy: req.user._id};

		Answer.create(newAnswers[i], function(err, answer) {
			if(err) {
				res.status(400)
				return res.send({reason:err.toString()})
			}
		});
	};
	res.send();
};