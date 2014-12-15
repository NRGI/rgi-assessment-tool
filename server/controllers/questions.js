var Question = require('mongoose').model('Question');

exports.getQuestions = function(req, res) {
	Question.find({}).exec(function(err, collection) {
		res.send(collection)
	});
};

exports.getQuestionsByID = function(req, res) {
	Question.findOne({_id:req.params.id}).exec(function(err, question) {
		res.send(question);
	});
};

exports.updateQuestion = function(req, res) {
	console.log(req.body);
};