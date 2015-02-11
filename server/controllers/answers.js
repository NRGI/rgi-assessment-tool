var Answer 		= require('mongoose').model('Answer'),
	Question 	= require('mongoose').model('Question'),
	upload 		= require('../utilities/s3');

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


	Question.find({}).exec(function(err, questions) {
		for (var i = questions.length - 1; i >= 0; i--) {

			for (var j = newAnswers.length - 1; j >= 0; j--) {

				if(questions[i]._id == newAnswers[j].question_ID) {
					newAnswers[j].question_text = questions[i].question_text;
					Answer.create(newAnswers[j], function(err, answer) {
						if(err) {
							res.status(400)
							return res.send({reason:err.toString()})
						}
					});
				}
			};
		};
	});
	
	res.send();
};