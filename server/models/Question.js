var mongoose 	= require('mongoose');

var questionSchema = mongoose.Schema({
	options_num : {type: Number, required:'{PATH} is required'},
	question_text : {type: String, required:'{PATH} is required'},
	row_id_org : Number,
	choice_2_criteria : String,
	choice_3_criteria : String,
	component : {type: String, required:'{PATH} is required'},
	choice_5_criteria : String,
	choice_4_criteria : String,
	choice_1_criteria : {type: String, required:'{PATH} is required'},
	row_id : Number,
	order : {type: Number, required:'{PATH} is required'},
});

var Question = mongoose.model('Question', questionSchema);

function createDefaultQuestions() {
	Question.find({}).exec(function(err, collection) {
		if(collection.length === 0) {
			Question.create({"options_num":5,"question_text":"Does the country have a clear legal definition of ownership of mineral resources?","row_id_org":4,"choice_2_criteria":"The constitution and national laws recognize or guarantee private property rights over mineral resources in the ground, with the exception of state-owned land.","choice_3_criteria":"The constitution and national laws give ownership of mineral resources in the ground to subnational governments, agencies or to indigenous groups.","component":"NULL","choice_5_criteria":"Not applicable/Other. (Explain in 'comments' box.)","choice_4_criteria":"The constitution and national laws recognize a mix of ownership rights.","choice_1_criteria":"The constitution and national laws grant ownership of all mineral resources in the ground to the sovereign state. The legislation does not recognize or guarantee private property rights over resources in the ground.","row_id":1,"order":1});
			Question.create({"options_num":4,"question_text":"Does the country have a long-term, comprehensive strategy to guide extractive resource management? ","choice_2_criteria":"The country has a long-term strategy to guide extractive resource management, but some essential information (described in full in Answer A) is missing (please explain).","choice_3_criteria":"The country has no long-term strategy to guide extractive resource management.","component":"Institutional and legal setting","choice_4_criteria":"Not applicable/Other. (Explain in 'comments' box.)","choice_1_criteria":"The country has a long-term strategy to guide extractive resource managementthat identifies economic and human development objectives, explains how government will govern the extractive sector (including aspects such as the fiscal regime, state participation, amd environmental impacts), determines how much revenues earned from resource extraction will be saved, whether and how the economy will be diversified, as well as spending on economic development. ","order":2});
			Question.create({"options_num":5,"question_text":"Who has the authority to grant hydrocarbon and mineral rights or licenses?","row_id_org":5,"choice_2_criteria":"A technical agency or regulator.","choice_3_criteria":"A state-owned company.","component":"NULL","choice_5_criteria":"Not applicable/Other. (Explain in 'comments' box.)","choice_4_criteria":"The office of the executive.","choice_1_criteria":"The ministry of the extractive sector.","row_id":2,"order":3});
			Question.create({"options_num":5,"question_text":"What licensing practices does the government commonly follow?","row_id_org":6,"choice_2_criteria":"The government grants mineral rights following direct negotiations.","choice_3_criteria":"The government follows the rule of \u201cfirst-come, first-served\u201d to grant mineral licenses, while royalties and taxes are set by legislation.","component":"NULL","choice_5_criteria":"Not applicable/Other. (Explain in 'comments' box.)","choice_4_criteria":"This country does not license mineral rights to private companies.","choice_1_criteria":"The government conducts open bidding rounds with sealed bid process and decision is made against established criteria (e.g. open bidding rounds can be either with fixed royalty rates and taxes but on the basis of work programs and expenditures, or on variable parameters such as bonuses, royalty rates, profit oil splits and cost recovery limits).  ","row_id":3,"order":4});
		}
	})
}

exports.createDefaultQuestions = createDefaultQuestions;