var mongoose 	= require('mongoose');

var modificationSchema = new mongoose.Schema({
	modifiedBy: String,
	modifiedDate: {type: Date, default:Date.now}
});

var questionSchema = mongoose.Schema({
	question_order: {type: Number, required:'{PATH} is required'},
	old_reference: {
		row_id_org: String,
		row_id: String,
		old_rwi_questionnaire_code: String,
		uid: String,
		qid: String,
		indaba_question_order: String,
		component_excel: String
	},
	component: {type: String, required:'{PATH} is required'},
	component_text: {type: String, required:'{PATH} is required'},
	indicator_name: String,
	sub_indicator_name: String,
	minstry_if_applicable: String,
	section_name: String,
	child_question: String,
	question_text : {type: String, required:'{PATH} is required'},
	question_choices:[
		{
			name:String,
			order:Number,
			criteria:String
		}
	],
	modified: [modificationSchema],
	nrc_precept: Number
});

var Question = mongoose.model('Question', questionSchema);
