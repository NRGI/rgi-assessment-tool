var mongoose 	= require('mongoose');

var assessmentSchema = mongoose.Schema({
	assessment_ID: {type: String, required:'{PATH} is required'}, // combination ISO3 + order_ID in Question Model with 2 leading 0's
	question_ID: {type: String, required:'{PATH} is required'}, // generated from _id value of Question Model
	user_ID: {type: String, required:'{PATH} is required'}, // generated from _id value of User Model
	question_order: {type: String, required:'{PATH} is required'}, // generated from the order_ID of Question Model
	component: {type: String, required:'{PATH} is required'}, // generated from Question Model
	status: {type: String, required:'{PATH} is required'}, // started, submitted, reviewing, reviewed, approved>
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

var Assessment = mongoose.model('Assessment', assessmentSchema);


function createDefaultAssessments() {
	Assessment.find({}).exec(function(err, collection) {
		if(collection.length === 0) {
			Assessment.create({question_ID: "547603069deb5f4abec1a2aa",question_order:1,user_ID: "54760b36de5f58c7c5c5d86b",assessment_ID:"NIG001",component:"NULL",status: "started",researcher_score: 2,comments: [{date: "12-12-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"},{date: "12-15-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"}]});
			Assessment.create({question_ID: "547603069deb5f4abec1a2b0",question_order:2,user_ID: "54760b36de5f58c7c5c5d86b",assessment_ID:"TZA002",component:"Institutional and legal setting",status: "reviewed",researcher_score: 2,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}],reviewer_score: 3});
			Assessment.create({question_ID: "547603069deb5f4abec1a2b5",question_order:3,user_ID: "54760b36de5f58c7c5c5d86f",assessment_ID:"MYA003",component:"NULL",status: "started",researcher_score: 1});
			Assessment.create({question_ID: "547603069deb5f4abec1a2bb",question_order:4,user_ID: "54760b36de5f58c7c5c5d86f",assessment_ID:"NOR004",component:"NULL",status: "reviewing",researcher_score: 4});
			Assessment.create({question_ID: "547603069deb5f4abec1a2bb",question_order:5,user_ID: "54760b36de5f58c7c5c5d86b",assessment_ID:"NIG005",component:"Government effectiveness",status: "submitted",researcher_score: 1,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}],comments: [{date: "12-12-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"},{date: "12-15-2000",content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eros ante, lobortis vitae volutpat sit amet, imperdiet eget dui. Aliquam erat volutpat. Sed scelerisque quis lectus non luctus. Proin nec dictum diam. Morbi sit amet iaculis dolor. Maecenas rutrum molestie placerat. Pellentesque eu eros quis dolor euismod placerat vel ut dui. Donec porta est quis turpis efficitur facilisis. Praesent luctus consequat aliquet. Nunc diam sapien, varius in malesuada id, sollicitudin nec velit. In fringilla commodo enim, eu pharetra velit ullamcorper nec. Vestibulum faucibus massa quis iaculis lacinia.",author: "54760b36de5f58c7c5c5d872"}],references: [{date_uploaded: "12-10-2000",tex_ref: "REFERENCE STRING",URL: "http://s3.com"},{date_uploaded: "12-15-2000",tex_ref: "REFERENCE STRING",URL: "http://s3.com"}]});
			Assessment.create({question_ID: "547603069deb5f4abec1a2c5",question_order:6,user_ID: "54760b36de5f58c7c5c5d86f",assessment_ID:"NIR006",component:"Government effectiveness",status: "approved",researcher_score: 4,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}],reviewer_score: 3});
			Assessment.create({question_ID: "547603069deb5f4abec1a2ca",question_order:7,user_ID: "54760b36de5f58c7c5c5d86f",assessment_ID:"NOR007",component:"Government effectiveness",status: "approved",researcher_score: 3,reviewer_score: 3});
			Assessment.create({question_ID: "547603069deb5f4abec1a2cf",question_order:8,user_ID: "54760b36de5f58c7c5c5d86f",assessment_ID:"TZA008",component:"NULL",status: "started",researcher_score: 2});
			Assessment.create({question_ID:"547603069deb5f4abec1a2d5",question_order:9,user_ID: "54760b36de5f58c7c5c5d86b",assessment_ID:"NIG009",component:"Institutional and legal setting",status: "submitted",researcher_score: 1,researcher_score_history: [{date: "12-12-2000",order: 1,score: 2},{date: "12-15-2000",order: 2,score: 4}]});
			Assessment.create({question_ID: "547603069deb5f4abec1a2d9",question_order:10,user_ID: "54760b36de5f58c7c5c5d86f",assessment_ID:"MYA010",component:"Institutional and legal setting",status: "reviewing",researcher_score: 3});
		}
	})
}

exports.createDefaultAssessments = createDefaultAssessments;