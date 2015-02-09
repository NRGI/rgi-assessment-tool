var mongoose 	= require('mongoose');

var ObjectId 	= mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
	modified_by: ObjectId,
	modified_date: Date
});

// var assignmentSchema = new mongoose.Schema();

var assessmentSchema = mongoose.Schema({
	assessment_ID: {type: String, required:'{PATH} is required'}, // ISO3 of country
	ISO3: {type: String, required:'{PATH} is required'}, // ISO3 of country
	country: {type: String, required:'{PATH} is required'}, // String of country name
	researcher_ID: ObjectId, // pulled from user_id
	reviewer_ID: ObjectId, // pulled from user_id
	edit_control: String, // user_ID of editing rights
	assignment: {assigned_by: ObjectId, assigned_date: Date},
	start_date: {started_by: ObjectId, started_date: Date},
	submit_date: {submitted_by: ObjectId, submitted_date: Date},
	review_date: {reviewed_by: ObjectId, reviewed_date: Date},
	approval: {approved_by: ObjectId, assigned_date: Date},
	modified: [modificationSchema],
	status: {type: String, required:'{PATH} is required', default:'unassigned'}, // unassigned, assigned, started, submitted, reviewing, reviewed, approved>
	questions_complete: {type:Number, default:0}
});

var Assessment = mongoose.model('Assessment', assessmentSchema);

function createDefaultAssessments() {
	Assessment.find({}).exec(function(err, collection) {
		if(collection.length === 0) {
			Assessment.create({assessment_ID: "TZ", ISO3:"TZA",country: "Tanzania"});
			Assessment.create({assessment_ID: "NG", ISO3:"NGA",country: "Nigeria"});
			Assessment.create({assessment_ID: "MM", ISO3:"MMR",country: "Myanmar"});
			Assessment.create({assessment_ID: "AO", ISO3:"AGO",country: "Angola"});
			Assessment.create({assessment_ID: "RU", ISO3:"RUS",country: "Russian Federation"});
			Assessment.create({assessment_ID: "MX", ISO3:"MEX",country: "Mexico"});
			Assessment.create({assessment_ID: "EG", ISO3:"EGY",country: "Egypt, Arab Rep."});
			Assessment.create({assessment_ID: "IR", ISO3:"IRN",country: "Iran, Islamic Rep."});
			Assessment.create({assessment_ID: "DZ", ISO3:"DZA",country: "Algeria"});
			Assessment.create({assessment_ID: "IQ", ISO3:"IRQ",country: "Iraq"});
			Assessment.create({assessment_ID: "PE", ISO3:"PER",country: "Peru"});
			Assessment.create({assessment_ID: "VE", ISO3:"VEN",country: "Venezuela, RB"});
			Assessment.create({assessment_ID: "AF", ISO3:"AFG",country: "Afghanistan"});
			Assessment.create({assessment_ID: "SA", ISO3:"SAU",country: "Saudi Arabia"});
			Assessment.create({assessment_ID: "GH", ISO3:"GHA",country: "Ghana"});
			Assessment.create({assessment_ID: "MZ", ISO3:"MOZ",country: "Mozambique"});
			Assessment.create({assessment_ID: "YE", ISO3:"YEM",country: "Yemen, Rep."});
			Assessment.create({assessment_ID: "KZ", ISO3:"KAZ",country: "Kazakhstan"});
			Assessment.create({assessment_ID: "EC", ISO3:"ECU",country: "Ecuador"});
			Assessment.create({assessment_ID: "ZM", ISO3:"ZMB",country: "Zambia"});
			Assessment.create({assessment_ID: "ZW", ISO3:"ZWE",country: "Zimbabwe"});
			Assessment.create({assessment_ID: "TD", ISO3:"TCD",country: "Chad"});
			Assessment.create({assessment_ID: "GN", ISO3:"GIN",country: "Guinea"});
			Assessment.create({assessment_ID: "BO", ISO3:"BOL",country: "Bolivia"});
			Assessment.create({assessment_ID: "AZ", ISO3:"AZE",country: "Azerbaijan"});
			Assessment.create({assessment_ID: "AE", ISO3:"ARE",country: "United Arab Emirates"});
			Assessment.create({assessment_ID: "LY", ISO3:"LBY",country: "Libya"});
			Assessment.create({assessment_ID: "KG", ISO3:"KGZ",country: "Kyrgyz Republic"});
			Assessment.create({assessment_ID: "NO", ISO3:"NOR",country: "Norway"});
			Assessment.create({assessment_ID: "CG", ISO3:"COG",country: "Congo, Rep."});
			Assessment.create({assessment_ID: "KW", ISO3:"KWT",country: "Kuwait"});
			Assessment.create({assessment_ID: "OM", ISO3:"OMN",country: "Oman"});
			Assessment.create({assessment_ID: "QA", ISO3:"QAT",country: "Qatar"});
			Assessment.create({assessment_ID: "GA", ISO3:"GAB",country: "Gabon"});
			Assessment.create({assessment_ID: "TT", ISO3:"TTO",country: "Trinidad and Tobago"});
			Assessment.create({assessment_ID: "BH", ISO3:"BHR",country: "Bahrain"});
			Assessment.create({assessment_ID: "CD", ISO3:"COD",country: "Congo, Dem. Rep."});
			Assessment.create({assessment_ID: "UZ", ISO3:"UZB",country: "Uzbekistan"});
			Assessment.create({assessment_ID: "SY", ISO3:"SYR",country: "Syrian Arab Republic"});
			Assessment.create({assessment_ID: "LA", ISO3:"LAO",country: "Lao PDR"});
			Assessment.create({assessment_ID: "ER", ISO3:"ERI",country: "Eritrea"});
			Assessment.create({assessment_ID: "TM", ISO3:"TKM",country: "Turkmenistan"});
			Assessment.create({assessment_ID: "LR", ISO3:"LBR",country: "Liberia"});
			Assessment.create({assessment_ID: "MN", ISO3:"MNG",country: "Mongolia"});
			Assessment.create({assessment_ID: "GW", ISO3:"GNB",country: "Guinea-Bissau"});
			Assessment.create({assessment_ID: "CO", ISO3:"COL",country: "Colombia"});
			Assessment.create({assessment_ID: "SD", ISO3:"SDN",country: "Sudan"});
			Assessment.create({assessment_ID: "CM", ISO3:"CMR",country: "Cameroon"});
			Assessment.create({assessment_ID: "CL", ISO3:"CHL",country: "Chile"});
			Assessment.create({assessment_ID: "NE", ISO3:"NER",country: "Niger"});
			Assessment.create({assessment_ID: "PG", ISO3:"PNG",country: "Papua New Guinea"});
			Assessment.create({assessment_ID: "MR", ISO3:"MRT",country: "Mauritania"});
			Assessment.create({assessment_ID: "IN", ISO3:"IND",country: "India"});
			Assessment.create({assessment_ID: "BR", ISO3:"BRA",country: "Brazil"});
			Assessment.create({assessment_ID: "ET", ISO3:"ETH",country: "Ethiopia"});
			Assessment.create({assessment_ID: "VN", ISO3:"VNM",country: "Vietnam"});
			Assessment.create({assessment_ID: "ZA", ISO3:"ZAF",country: "South Africa"});
			Assessment.create({assessment_ID: "UG", ISO3:"UGA",country: "Uganda"});
			Assessment.create({assessment_ID: "CA", ISO3:"CAN",country: "Canada"});
			Assessment.create({assessment_ID: "MY", ISO3:"MYS",country: "Malaysia"});
			Assessment.create({assessment_ID: "AU", ISO3:"AUS",country: "Australia"});
			Assessment.create({assessment_ID: "BF", ISO3:"BFA",country: "Burkina Faso"});
			Assessment.create({assessment_ID: "ML", ISO3:"MLI",country: "Mali"});
			Assessment.create({assessment_ID: "SN", ISO3:"SEN",country: "Senegal"});
			Assessment.create({assessment_ID: "RW", ISO3:"RWA",country: "Rwanda"});
			Assessment.create({assessment_ID: "GR", ISO3:"GRC",country: "Greece"});
			Assessment.create({assessment_ID: "BI", ISO3:"BDI",country: "Burundi"});
			Assessment.create({assessment_ID: "BY", ISO3:"BLR",country: "Belarus"});
			Assessment.create({assessment_ID: "BG", ISO3:"BGR",country: "Bulgaria"});
			Assessment.create({assessment_ID: "PY", ISO3:"PRY",country: "Paraguay"});
			Assessment.create({assessment_ID: "SL", ISO3:"SLE",country: "Sierra Leone"});
			Assessment.create({assessment_ID: "GE", ISO3:"GEO",country: "Georgia"});
			Assessment.create({assessment_ID: "CF", ISO3:"CAF",country: "Central African Republic"});
			Assessment.create({assessment_ID: "BA", ISO3:"BIH",country: "Bosnia and Herzegovina"});
			Assessment.create({assessment_ID: "LT", ISO3:"LTU",country: "Lithuania"});
			Assessment.create({assessment_ID: "AM", ISO3:"ARM",country: "Armenia"});
			Assessment.create({assessment_ID: "AL", ISO3:"ALB",country: "Albania"});
			Assessment.create({assessment_ID: "JM", ISO3:"JAM",country: "Jamaica"});
			Assessment.create({assessment_ID: "ID", ISO3:"IDN",country: "Indonesia"});
			Assessment.create({assessment_ID: "CI", ISO3:"CIV",country: "Cote d'Ivoire"});
			Assessment.create({assessment_ID: "NA", ISO3:"NAM",country: "Namibia"});
			Assessment.create({assessment_ID: "BW", ISO3:"BWA",country: "Botswana"});
		}
	})
};

exports.createDefaultAssessments = createDefaultAssessments;

