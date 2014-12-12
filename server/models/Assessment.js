var mongoose 	= require('mongoose');

var assessmentSchema = mongoose.Schema({
	assessment_ID: {type: String, required:'{PATH} is required'}, // ISO3 of country
	country: {type: String, required:'{PATH} is required'}, // String of country name
	researcher_ID: String, // pulled from user_id
	reviewer_ID: String, // pulled from user_id
	edit_control: String, // user_ID of editing rights
	assign_date: Date,
	start_date: Date,
	submit_date: Date,
	review_date: Date,
	approval_date: Date,
	last_edit: Date,
	status: {type: String, required:'{PATH} is required', default:'unassigned'}, // unassigned, assigned, started, submitted, reviewing, reviewed, approved>
	quesions_complete: {type:Number, default:0}
});

var Assessment = mongoose.model('Assessment', assessmentSchema);

function createDefaultAssessments() {
	Assessment.find({}).exec(function(err, collection) {
		if(collection.length === 0) {
			Assessment.create({assessment_ID: "TZA", country: "Tanzania"});
			Assessment.create({assessment_ID: "NGA",country: "Nigeria"});
			Assessment.create({assessment_ID: "MMR",country: "Myanmar"});
			Assessment.create({assessment_ID: "AGO",country: "Angola"});
			Assessment.create({assessment_ID: "RUS",country: "Russian Federation"});
			Assessment.create({assessment_ID: "MEX",country: "Mexico"});
			Assessment.create({assessment_ID: "EGY",country: "Egypt, Arab Rep."});
			Assessment.create({assessment_ID: "IRN",country: "Iran, Islamic Rep."});
			Assessment.create({assessment_ID: "DZA",country: "Algeria"});
			Assessment.create({assessment_ID: "IRQ",country: "Iraq"});
			Assessment.create({assessment_ID: "PER",country: "Peru"});
			Assessment.create({assessment_ID: "VEN",country: "Venezuela, RB"});
			Assessment.create({assessment_ID: "AFG",country: "Afghanistan"});
			Assessment.create({assessment_ID: "SAU",country: "Saudi Arabia"});
			Assessment.create({assessment_ID: "GHA",country: "Ghana"});
			Assessment.create({assessment_ID: "MOZ",country: "Mozambique"});
			Assessment.create({assessment_ID: "YEM",country: "Yemen, Rep."});
			Assessment.create({assessment_ID: "KAZ",country: "Kazakhstan"});
			Assessment.create({assessment_ID: "ECU",country: "Ecuador"});
			Assessment.create({assessment_ID: "ZMB",country: "Zambia"});
			Assessment.create({assessment_ID: "ZWE",country: "Zimbabwe"});
			Assessment.create({assessment_ID: "TCD",country: "Chad"});
			Assessment.create({assessment_ID: "GIN",country: "Guinea"});
			Assessment.create({assessment_ID: "BOL",country: "Bolivia"});
			Assessment.create({assessment_ID: "AZE",country: "Azerbaijan"});
			Assessment.create({assessment_ID: "ARE",country: "United Arab Emirates"});
			Assessment.create({assessment_ID: "LBY",country: "Libya"});
			Assessment.create({assessment_ID: "KGZ",country: "Kyrgyz Republic"});
			Assessment.create({assessment_ID: "NOR",country: "Norway"});
			Assessment.create({assessment_ID: "COG",country: "Congo, Rep."});
			Assessment.create({assessment_ID: "KWT",country: "Kuwait"});
			Assessment.create({assessment_ID: "OMN",country: "Oman"});
			Assessment.create({assessment_ID: "QAT",country: "Qatar"});
			Assessment.create({assessment_ID: "GAB",country: "Gabon"});
			Assessment.create({assessment_ID: "TTO",country: "Trinidad and Tobago"});
			Assessment.create({assessment_ID: "BHR",country: "Bahrain"});
			Assessment.create({assessment_ID: "COD",country: "Congo, Dem. Rep."});
			Assessment.create({assessment_ID: "UZB",country: "Uzbekistan"});
			Assessment.create({assessment_ID: "SYR",country: "Syrian Arab Republic"});
			Assessment.create({assessment_ID: "LAO",country: "Lao PDR"});
			Assessment.create({assessment_ID: "ERI",country: "Eritrea"});
			Assessment.create({assessment_ID: "TKM",country: "Turkmenistan"});
			Assessment.create({assessment_ID: "LBR",country: "Liberia"});
			Assessment.create({assessment_ID: "MNG",country: "Mongolia"});
			Assessment.create({assessment_ID: "GNB",country: "Guinea-Bissau"});
			Assessment.create({assessment_ID: "COL",country: "Colombia"});
			Assessment.create({assessment_ID: "SDN",country: "Sudan"});
			Assessment.create({assessment_ID: "CMR",country: "Cameroon"});
			Assessment.create({assessment_ID: "CHL",country: "Chile"});
			Assessment.create({assessment_ID: "NER",country: "Niger"});
			Assessment.create({assessment_ID: "PNG",country: "Papua New Guinea"});
			Assessment.create({assessment_ID: "MRT",country: "Mauritania"});
			Assessment.create({assessment_ID: "IND",country: "India"});
			Assessment.create({assessment_ID: "BRA",country: "Brazil"});
			Assessment.create({assessment_ID: "ETH",country: "Ethiopia"});
			Assessment.create({assessment_ID: "VNM",country: "Vietnam"});
			Assessment.create({assessment_ID: "ZAF",country: "South Africa"});
			Assessment.create({assessment_ID: "UGA",country: "Uganda"});
			Assessment.create({assessment_ID: "CAN",country: "Canada"});
			Assessment.create({assessment_ID: "MYS",country: "Malaysia"});
			Assessment.create({assessment_ID: "AUS",country: "Australia"});
			Assessment.create({assessment_ID: "BFA",country: "Burkina Faso"});
			Assessment.create({assessment_ID: "MLI",country: "Mali"});
			Assessment.create({assessment_ID: "SEN",country: "Senegal"});
			Assessment.create({assessment_ID: "RWA",country: "Rwanda"});
			Assessment.create({assessment_ID: "GRC",country: "Greece"});
			Assessment.create({assessment_ID: "BDI",country: "Burundi"});
			Assessment.create({assessment_ID: "BLR",country: "Belarus"});
			Assessment.create({assessment_ID: "BGR",country: "Bulgaria"});
			Assessment.create({assessment_ID: "PRY",country: "Paraguay"});
			Assessment.create({assessment_ID: "SLE",country: "Sierra Leone"});
			Assessment.create({assessment_ID: "GEO",country: "Georgia"});
			Assessment.create({assessment_ID: "CAF",country: "Central African Republic"});
			Assessment.create({assessment_ID: "BIH",country: "Bosnia and Herzegovina"});
			Assessment.create({assessment_ID: "LTU",country: "Lithuania"});
			Assessment.create({assessment_ID: "ARM",country: "Armenia"});
			Assessment.create({assessment_ID: "ALB",country: "Albania"});
			Assessment.create({assessment_ID: "JAM",country: "Jamaica"});
			Assessment.create({assessment_ID: "IDN",country: "Indonesia"});
			Assessment.create({assessment_ID: "CIV",country: "Cote d'Ivoire"});
			Assessment.create({assessment_ID: "NAM",country: "Namibia"});
			Assessment.create({assessment_ID: "BWA",country: "Botswana"});
		}
	})
};

exports.createDefaultAssessments = createDefaultAssessments;

