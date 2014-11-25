var mongoose 	= require('mongoose');

var questionSchema = mongoose.Schema({
	options_num : Number,
	question_text : String,
	row_id_org : Number,
	choice_2_criteria : String,
	choice_3_criteria : String,
	component : String,
	choice_5_criteria : String,
	choice_4_criteria : String,
	choice_1_criteria : String,
	row_id : Number,
	order : Number
});

var Question = mongoose.model('Question', questionSchema);