var Question = require('mongoose').model('Question');

exports.getQuestions = function(req, res) {
	Question.find({}).exec(function(err, collection) {
		res.send(collection)
	});
}
