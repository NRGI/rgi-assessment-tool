var Answer = require('mongoose').model('Answer');

exports.getAnswers = function(req, res) {
	Answer.find({}).exec(function(err, collection) {
		res.send(collection)
	});
}
