var mongoose 	= require('mongoose');

var answerSchema = mongoose.Schema({
	answer_ID: {type: String, required:'{PATH} is required'}, // combination ISO3 + question_order in Question Model with 2 leading 0's
	question_ID: {type: String, required:'{PATH} is required'}, // generated from _id value of Question Model
	assessment_ID: {type: String, required:'{PATH} is required'}, // generated from assessment_ID value of Assessment Model (ISO3 country)
	researcher_ID: {type: String, required:'{PATH} is required'}, // generated from _id value of User Model
	reviewer_ID: {type: String, required:'{PATH} is required'}, // generated from _id value of User Model
	question_order: {type: String, required:'{PATH} is required'}, // generated from the order_ID of Question Model
	component: {type: String, required:'{PATH} is required'}, // generated from Question Model
	status: String, // started, submitted, reviewing, reviewed, approved>
	assigned: {assignedBy:String, assignedDate:{type:Date, default:Date.now}},
	researcher_score: Number,
	/////ERROR CALCULATION
	researcher_score_history: [{
		date: {type: Date, default:Date.now},
		order: Number,
		score: Number
		/////ERROR CALCULATION
	}],
	reviewer_score: Number,
	/////ERROR CALCULATION
	reviewer_score_history: [{
		date: {type: Date, default:Date.now},
		order: Number,
		score: Number
		/////ERROR CALCULATION
	}],
	comments: [{
		date: {type: Date, default:Date.now},
		content: String,
		author: String // Pull from curretn user _id value
	}],
	references: [{
		date_uploaded: {type: Date, default:Date.now},
		tex_ref: String,
		URL: String // generated from upload path in S3
	}]
});

var Answer = mongoose.model('Answer', answerSchema);

// function createDefaultAnswers() {
// 	Answer.find({}).exec(function(err, collection) {
// 		if(collection.length === 0) {
// 			Answer.create({question_ID: "547c936c1d0a3744a5b367ea",question_order:1,reviewer_ID: "547c9269d56df758a465c35b",researcher_ID: "547c9269d56df758a465c359",assessment_ID:"NGA",answer_ID:"NGA001",component:"NULL",status: "started",researcher_score: 2,comments: [{date: "12-12-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"},{date: "12-15-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"}]});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b367f0",question_order:2,reviewer_ID: "547c9269d56df758a465c360",researcher_ID: "547c9269d56df758a465c35d",assessment_ID:"TZA",answer_ID:"TZA002",component:"Institutional and legal setting",status: "reviewed",researcher_score: 2,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}],reviewer_score: 3});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b367f5",question_order:3,reviewer_ID: "547c9269d56df758a465c360",researcher_ID: "547c9269d56df758a465c35d",assessment_ID:"MMR",answer_ID:"MMR003",component:"NULL",status: "started",researcher_score: 1});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b367fb",question_order:4,reviewer_ID: "547c9269d56df758a465c360",researcher_ID: "547c9269d56df758a465c35d",assessment_ID:"TZA",answer_ID:"TZA004",component:"NULL",status: "reviewing",researcher_score: 4});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b36801",question_order:5,reviewer_ID: "547c9269d56df758a465c35b",researcher_ID: "547c9269d56df758a465c359",assessment_ID:"NGA",answer_ID:"NGA005",component:"Government effectiveness",status: "submitted",researcher_score: 1,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}],comments: [{date: "12-12-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"},{date: "12-15-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"}],references: [{date_uploaded: "12-10-2000",tex_ref: "REFERENCE STRING",URL: "http://s3.com"},{date_uploaded: "12-15-2000",tex_ref: "REFERENCE STRING",URL: "http://s3.com"}]});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b36805",question_order:6,reviewer_ID: "547c9269d56df758a465c359",researcher_ID: "54760b36de5f58c7c5c5d86f",assessment_ID:"NIR",answer_ID:"NIR006",component:"Government effectiveness",status: "approved",researcher_score: 4,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}],reviewer_score: 3});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b3680a",question_order:7,reviewer_ID: "547c9269d56df758a465c360",researcher_ID: "547c9269d56df758a465c35d",assessment_ID:"MMR",answer_ID:"MMR007",component:"Government effectiveness",status: "approved",researcher_score: 3,reviewer_score: 3});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b3680f",question_order:8,reviewer_ID: "547c9269d56df758a465c360",researcher_ID: "547c9269d56df758a465c35d",assessment_ID:"TZA",answer_ID:"TZA008",component:"NULL",status: "started",researcher_score: 2});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b36815",question_order:9,reviewer_ID: "547c9269d56df758a465c35b",researcher_ID: "547c9269d56df758a465c359",assessment_ID:"NGA",answer_ID:"NGA009",component:"Institutional and legal setting",status: "submitted",researcher_score: 1,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}]});
// 			Answer.create({question_ID: "547c936c1d0a3744a5b36819",question_order:10,reviewer_ID: "547c9269d56df758a465c360",researcher_ID: "547c9269d56df758a465c35d",assessment_ID:"MMR",answer_ID:"MMR010",component:"Institutional and legal setting",status: "reviewing",researcher_score: 3});
// 		}
// 	})
// };

// exports.createDefaultAnswers = createDefaultAnswers;