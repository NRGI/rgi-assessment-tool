'use strict';
/*jslint unparam: true*/

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modified_by: ObjectId,
    modified_date: Date
});


var assessmentSchema = mongoose.Schema({
    assessment_ID: {type: String, required: '{PATH} is required', index: true}, // ISO2 of country + Year + Pilot vs full
    ISO3: {type: String, required: '{PATH} is required'}, // ISO3 of country
    country: {type: String, required: '{PATH} is required'}, // String of country name
    year: {type: String, required: '{PATH} is required'},
    version: {type: String, required: '{PATH} is required'},  // pilot or full
    researcher_ID: {type: ObjectId, index: true}, // pulled from user_id
    reviewer_ID: {type: ObjectId, index: true}, // pulled from user_id
    edit_control: ObjectId, // user_ID of editing rights
    status: {type: String, required: '{PATH} is required', default: 'unassigned'}, // unassigned, assigned, started, submitted, review, reassigned, approved


    assignment: {assigned_by: ObjectId, assigned_date: Date},
    start_date: {started_by: ObjectId, started_date: Date},
    submit_date: {submitted_by: ObjectId, submitted_date: Date},
    review_date: {reviewed_by: ObjectId, reviewed_date: Date},
    approval: {approved_by: ObjectId, approved_date: Date},
    modified: [modificationSchema],
    questions_complete: {type: Number, default: 0}
});

var Assessment = mongoose.model('Assessment', assessmentSchema);

function createDefaultAssessments() {
    Assessment.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            // Assessment.create({assessment_ID: "TZ-2015-PI", ISO3: "TZA", year: "2015", version: "pilot", country: "Tanzania"});
            // Assessment.create({assessment_ID: "NG-2015-PI", ISO3: "NGA", year: "2015", version: "pilot", country: "Nigeria"});
            // Assessment.create({assessment_ID: "MM-2015-PI", ISO3: "MMR", year: "2015", version: "pilot", country: "Myanmar"});
            // Assessment.create({assessment_ID: "AO-2015-PI", ISO3: "AGO", year: "2015", version: "pilot", country: "Angola"});
            // Assessment.create({assessment_ID: "RU-2015-PI", ISO3: "RUS", year: "2015", version: "pilot", country: "Russian Federation"});
            // Assessment.create({assessment_ID: "MX-2015-PI", ISO3: "MEX", year: "2015", version: "pilot", country: "Mexico"});
            // Assessment.create({assessment_ID: "EG-2015-PI", ISO3: "EGY", year: "2015", version: "pilot", country: "Egypt, Arab Rep."});
            // Assessment.create({assessment_ID: "IR-2015-PI", ISO3: "IRN", year: "2015", version: "pilot", country: "Iran, Islamic Rep."});
            // Assessment.create({assessment_ID: "DZ-2015-PI", ISO3: "DZA", year: "2015", version: "pilot", country: "Algeria"});
            // Assessment.create({assessment_ID: "IQ-2015-PI", ISO3: "IRQ", year: "2015", version: "pilot", country: "Iraq"});
            // Assessment.create({assessment_ID: "PE-2015-PI", ISO3: "PER", year: "2015", version: "pilot", country: "Peru"});
            // Assessment.create({assessment_ID: "VE-2015-PI", ISO3: "VEN", year: "2015", version: "pilot", country: "Venezuela, RB"});
            // Assessment.create({assessment_ID: "AF-2015-PI", ISO3: "AFG", year: "2015", version: "pilot", country: "Afghanistan"});
            // Assessment.create({assessment_ID: "SA-2015-PI", ISO3: "SAU", year: "2015", version: "pilot", country: "Saudi Arabia"});
            // Assessment.create({assessment_ID: "GH-2015-PI", ISO3: "GHA", year: "2015", version: "pilot", country: "Ghana"});
            // Assessment.create({assessment_ID: "MZ-2015-PI", ISO3: "MOZ", year: "2015", version: "pilot", country: "Mozambique"});
            // Assessment.create({assessment_ID: "YE-2015-PI", ISO3: "YEM", year: "2015", version: "pilot", country: "Yemen, Rep."});
            // Assessment.create({assessment_ID: "KZ-2015-PI", ISO3: "KAZ", year: "2015", version: "pilot", country: "Kazakhstan"});
            // Assessment.create({assessment_ID: "EC-2015-PI", ISO3: "ECU", year: "2015", version: "pilot", country: "Ecuador"});
            // Assessment.create({assessment_ID: "ZM-2015-PI", ISO3: "ZMB", year: "2015", version: "pilot", country: "Zambia"});
            // Assessment.create({assessment_ID: "ZW-2015-PI", ISO3: "ZWE", year: "2015", version: "pilot", country: "Zimbabwe"});
            // Assessment.create({assessment_ID: "TD-2015-PI", ISO3: "TCD", year: "2015", version: "pilot", country: "Chad"});
            // Assessment.create({assessment_ID: "GN-2015-PI", ISO3: "GIN", year: "2015", version: "pilot", country: "Guinea"});
            // Assessment.create({assessment_ID: "BO-2015-PI", ISO3: "BOL", year: "2015", version: "pilot", country: "Bolivia"});
            // Assessment.create({assessment_ID: "AZ-2015-PI", ISO3: "AZE", year: "2015", version: "pilot", country: "Azerbaijan"});
            // Assessment.create({assessment_ID: "AE-2015-PI", ISO3: "ARE", year: "2015", version: "pilot", country: "United Arab Emirates"});
            // Assessment.create({assessment_ID: "LY-2015-PI", ISO3: "LBY", year: "2015", version: "pilot", country: "Libya"});
            // Assessment.create({assessment_ID: "KG-2015-PI", ISO3: "KGZ", year: "2015", version: "pilot", country: "Kyrgyz Republic"});
            // Assessment.create({assessment_ID: "NO-2015-PI", ISO3: "NOR", year: "2015", version: "pilot", country: "Norway"});
            // Assessment.create({assessment_ID: "CG-2015-PI", ISO3: "COG", year: "2015", version: "pilot", country: "Congo, Rep."});
            // Assessment.create({assessment_ID: "KW-2015-PI", ISO3: "KWT", year: "2015", version: "pilot", country: "Kuwait"});
            // Assessment.create({assessment_ID: "OM-2015-PI", ISO3: "OMN", year: "2015", version: "pilot", country: "Oman"});
            // Assessment.create({assessment_ID: "QA-2015-PI", ISO3: "QAT", year: "2015", version: "pilot", country: "Qatar"});
            // Assessment.create({assessment_ID: "GA-2015-PI", ISO3: "GAB", year: "2015", version: "pilot", country: "Gabon"});
            // Assessment.create({assessment_ID: "TT-2015-PI", ISO3: "TTO", year: "2015", version: "pilot", country: "Trinidad and Tobago"});
            // Assessment.create({assessment_ID: "BH-2015-PI", ISO3: "BHR", year: "2015", version: "pilot", country: "Bahrain"});
            // Assessment.create({assessment_ID: "CD-2015-PI", ISO3: "COD", year: "2015", version: "pilot", country: "Congo, Dem. Rep."});
            // Assessment.create({assessment_ID: "UZ-2015-PI", ISO3: "UZB", year: "2015", version: "pilot", country: "Uzbekistan"});
            // Assessment.create({assessment_ID: "SY-2015-PI", ISO3: "SYR", year: "2015", version: "pilot", country: "Syrian Arab Republic"});
            // Assessment.create({assessment_ID: "LA-2015-PI", ISO3: "LAO", year: "2015", version: "pilot", country: "Lao PDR"});
            // Assessment.create({assessment_ID: "ER-2015-PI", ISO3: "ERI", year: "2015", version: "pilot", country: "Eritrea"});
            // Assessment.create({assessment_ID: "TM-2015-PI", ISO3: "TKM", year: "2015", version: "pilot", country: "Turkmenistan"});
            // Assessment.create({assessment_ID: "LR-2015-PI", ISO3: "LBR", year: "2015", version: "pilot", country: "Liberia"});
            // Assessment.create({assessment_ID: "MN-2015-PI", ISO3: "MNG", year: "2015", version: "pilot", country: "Mongolia"});
            // Assessment.create({assessment_ID: "GW-2015-PI", ISO3: "GNB", year: "2015", version: "pilot", country: "Guinea-Bissau"});
            // Assessment.create({assessment_ID: "CO-2015-PI", ISO3: "COL", year: "2015", version: "pilot", country: "Colombia"});
            // Assessment.create({assessment_ID: "SD-2015-PI", ISO3: "SDN", year: "2015", version: "pilot", country: "Sudan"});
            // Assessment.create({assessment_ID: "CM-2015-PI", ISO3: "CMR", year: "2015", version: "pilot", country: "Cameroon"});
            // Assessment.create({assessment_ID: "CL-2015-PI", ISO3: "CHL", year: "2015", version: "pilot", country: "Chile"});
            // Assessment.create({assessment_ID: "NE-2015-PI", ISO3: "NER", year: "2015", version: "pilot", country: "Niger"});
            // Assessment.create({assessment_ID: "PG-2015-PI", ISO3: "PNG", year: "2015", version: "pilot", country: "Papua New Guinea"});
            // Assessment.create({assessment_ID: "MR-2015-PI", ISO3: "MRT", year: "2015", version: "pilot", country: "Mauritania"});
            // Assessment.create({assessment_ID: "IN-2015-PI", ISO3: "IND", year: "2015", version: "pilot", country: "India"});
            // Assessment.create({assessment_ID: "BR-2015-PI", ISO3: "BRA", year: "2015", version: "pilot", country: "Brazil"});
            // Assessment.create({assessment_ID: "ET-2015-PI", ISO3: "ETH", year: "2015", version: "pilot", country: "Ethiopia"});
            // Assessment.create({assessment_ID: "VN-2015-PI", ISO3: "VNM", year: "2015", version: "pilot", country: "Vietnam"});
            // Assessment.create({assessment_ID: "ZA-2015-PI", ISO3: "ZAF", year: "2015", version: "pilot", country: "South Africa"});
            // Assessment.create({assessment_ID: "UG-2015-PI", ISO3: "UGA", year: "2015", version: "pilot", country: "Uganda"});
            // Assessment.create({assessment_ID: "CA-2015-PI", ISO3: "CAN", year: "2015", version: "pilot", country: "Canada"});
            // Assessment.create({assessment_ID: "MY-2015-PI", ISO3: "MYS", year: "2015", version: "pilot", country: "Malaysia"});
            // Assessment.create({assessment_ID: "AU-2015-PI", ISO3: "AUS", year: "2015", version: "pilot", country: "Australia"});
            // Assessment.create({assessment_ID: "BF-2015-PI", ISO3: "BFA", year: "2015", version: "pilot", country: "Burkina Faso"});
            // Assessment.create({assessment_ID: "ML-2015-PI", ISO3: "MLI", year: "2015", version: "pilot", country: "Mali"});
            // Assessment.create({assessment_ID: "SN-2015-PI", ISO3: "SEN", year: "2015", version: "pilot", country: "Senegal"});
            // Assessment.create({assessment_ID: "RW-2015-PI", ISO3: "RWA", year: "2015", version: "pilot", country: "Rwanda"});
            // Assessment.create({assessment_ID: "GR-2015-PI", ISO3: "GRC", year: "2015", version: "pilot", country: "Greece"});
            // Assessment.create({assessment_ID: "BI-2015-PI", ISO3: "BDI", year: "2015", version: "pilot", country: "Burundi"});
            // Assessment.create({assessment_ID: "BY-2015-PI", ISO3: "BLR", year: "2015", version: "pilot", country: "Belarus"});
            // Assessment.create({assessment_ID: "BG-2015-PI", ISO3: "BGR", year: "2015", version: "pilot", country: "Bulgaria"});
            // Assessment.create({assessment_ID: "PY-2015-PI", ISO3: "PRY", year: "2015", version: "pilot", country: "Paraguay"});
            // Assessment.create({assessment_ID: "SL-2015-PI", ISO3: "SLE", year: "2015", version: "pilot", country: "Sierra Leone"});
            // Assessment.create({assessment_ID: "GE-2015-PI", ISO3: "GEO", year: "2015", version: "pilot", country: "Georgia"});
            // Assessment.create({assessment_ID: "CF-2015-PI", ISO3: "CAF", year: "2015", version: "pilot", country: "Central African Republic"});
            // Assessment.create({assessment_ID: "BA-2015-PI", ISO3: "BIH", year: "2015", version: "pilot", country: "Bosnia and Herzegovina"});
            // Assessment.create({assessment_ID: "LT-2015-PI", ISO3: "LTU", year: "2015", version: "pilot", country: "Lithuania"});
            // Assessment.create({assessment_ID: "AM-2015-PI", ISO3: "ARM", year: "2015", version: "pilot", country: "Armenia"});
            // Assessment.create({assessment_ID: "AL-2015-PI", ISO3: "ALB", year: "2015", version: "pilot", country: "Albania"});
            // Assessment.create({assessment_ID: "JM-2015-PI", ISO3: "JAM", year: "2015", version: "pilot", country: "Jamaica"});
            // Assessment.create({assessment_ID: "ID-2015-PI", ISO3: "IDN", year: "2015", version: "pilot", country: "Indonesia"});
            // Assessment.create({assessment_ID: "CI-2015-PI", ISO3: "CIV", year: "2015", version: "pilot", country: "Cote d'Ivoire"});
            // Assessment.create({assessment_ID: "NA-2015-PI", ISO3: "NAM", year: "2015", version: "pilot", country: "Namibia"});
            // Assessment.create({assessment_ID: "BW-2015-PI", ISO3: "BWA", year: "2015", version: "pilot", country: "Botswana"});

            // Assessment.create({assessment_ID: "TZ-2015-FU", ISO3: "TZA", year: "2015", country: "Tanzania"});
            // Assessment.create({assessment_ID: "NG-2015-FU", ISO3: "NGA", year: "2015", country: "Nigeria"});
            // Assessment.create({assessment_ID: "MM-2015-FU", ISO3: "MMR", year: "2015", country: "Myanmar"});
            // Assessment.create({assessment_ID: "AO-2015-FU", ISO3: "AGO", year: "2015", country: "Angola"});
            // Assessment.create({assessment_ID: "RU-2015-FU", ISO3: "RUS", year: "2015", country: "Russian Federation"});
            // Assessment.create({assessment_ID: "MX-2015-FU", ISO3: "MEX", year: "2015", country: "Mexico"});
            // Assessment.create({assessment_ID: "EG-2015-FU", ISO3: "EGY", year: "2015", country: "Egypt, Arab Rep."});
            // Assessment.create({assessment_ID: "IR-2015-FU", ISO3: "IRN", year: "2015", country: "Iran, Islamic Rep."});
            // Assessment.create({assessment_ID: "DZ-2015-FU", ISO3: "DZA", year: "2015", country: "Algeria"});
            // Assessment.create({assessment_ID: "IQ-2015-FU", ISO3: "IRQ", year: "2015", country: "Iraq"});
            // Assessment.create({assessment_ID: "PE-2015-FU", ISO3: "PER", year: "2015", country: "Peru"});
            // Assessment.create({assessment_ID: "VE-2015-FU", ISO3: "VEN", year: "2015", country: "Venezuela, RB"});
            // Assessment.create({assessment_ID: "AF-2015-FU", ISO3: "AFG", year: "2015", country: "Afghanistan"});
            // Assessment.create({assessment_ID: "SA-2015-FU", ISO3: "SAU", year: "2015", country: "Saudi Arabia"});
            // Assessment.create({assessment_ID: "GH-2015-FU", ISO3: "GHA", year: "2015", country: "Ghana"});
            // Assessment.create({assessment_ID: "MZ-2015-FU", ISO3: "MOZ", year: "2015", country: "Mozambique"});
            // Assessment.create({assessment_ID: "YE-2015-FU", ISO3: "YEM", year: "2015", country: "Yemen, Rep."});
            // Assessment.create({assessment_ID: "KZ-2015-FU", ISO3: "KAZ", year: "2015", country: "Kazakhstan"});
            // Assessment.create({assessment_ID: "EC-2015-FU", ISO3: "ECU", year: "2015", country: "Ecuador"});
            // Assessment.create({assessment_ID: "ZM-2015-FU", ISO3: "ZMB", year: "2015", country: "Zambia"});
            // Assessment.create({assessment_ID: "ZW-2015-FU", ISO3: "ZWE", year: "2015", country: "Zimbabwe"});
            // Assessment.create({assessment_ID: "TD-2015-FU", ISO3: "TCD", year: "2015", country: "Chad"});
            // Assessment.create({assessment_ID: "GN-2015-FU", ISO3: "GIN", year: "2015", country: "Guinea"});
            // Assessment.create({assessment_ID: "BO-2015-FU", ISO3: "BOL", year: "2015", country: "Bolivia"});
            // Assessment.create({assessment_ID: "AZ-2015-FU", ISO3: "AZE", year: "2015", country: "Azerbaijan"});
            // Assessment.create({assessment_ID: "AE-2015-FU", ISO3: "ARE", year: "2015", country: "United Arab Emirates"});
            // Assessment.create({assessment_ID: "LY-2015-FU", ISO3: "LBY", year: "2015", country: "Libya"});
            // Assessment.create({assessment_ID: "KG-2015-FU", ISO3: "KGZ", year: "2015", country: "Kyrgyz Republic"});
            // Assessment.create({assessment_ID: "NO-2015-FU", ISO3: "NOR", year: "2015", country: "Norway"});
            // Assessment.create({assessment_ID: "CG-2015-FU", ISO3: "COG", year: "2015", country: "Congo, Rep."});
            // Assessment.create({assessment_ID: "KW-2015-FU", ISO3: "KWT", year: "2015", country: "Kuwait"});
            // Assessment.create({assessment_ID: "OM-2015-FU", ISO3: "OMN", year: "2015", country: "Oman"});
            // Assessment.create({assessment_ID: "QA-2015-FU", ISO3: "QAT", year: "2015", country: "Qatar"});
            // Assessment.create({assessment_ID: "GA-2015-FU", ISO3: "GAB", year: "2015", country: "Gabon"});
            // Assessment.create({assessment_ID: "TT-2015-FU", ISO3: "TTO", year: "2015", country: "Trinidad and Tobago"});
            // Assessment.create({assessment_ID: "BH-2015-FU", ISO3: "BHR", year: "2015", country: "Bahrain"});
            // Assessment.create({assessment_ID: "CD-2015-FU", ISO3: "COD", year: "2015", country: "Congo, Dem. Rep."});
            // Assessment.create({assessment_ID: "UZ-2015-FU", ISO3: "UZB", year: "2015", country: "Uzbekistan"});
            // Assessment.create({assessment_ID: "SY-2015-FU", ISO3: "SYR", year: "2015", country: "Syrian Arab Republic"});
            // Assessment.create({assessment_ID: "LA-2015-FU", ISO3: "LAO", year: "2015", country: "Lao PDR"});
            // Assessment.create({assessment_ID: "ER-2015-FU", ISO3: "ERI", year: "2015", country: "Eritrea"});
            // Assessment.create({assessment_ID: "TM-2015-FU", ISO3: "TKM", year: "2015", country: "Turkmenistan"});
            // Assessment.create({assessment_ID: "LR-2015-FU", ISO3: "LBR", year: "2015", country: "Liberia"});
            // Assessment.create({assessment_ID: "MN-2015-FU", ISO3: "MNG", year: "2015", country: "Mongolia"});
            // Assessment.create({assessment_ID: "GW-2015-FU", ISO3: "GNB", year: "2015", country: "Guinea-Bissau"});
            // Assessment.create({assessment_ID: "CO-2015-FU", ISO3: "COL", year: "2015", country: "Colombia"});
            // Assessment.create({assessment_ID: "SD-2015-FU", ISO3: "SDN", year: "2015", country: "Sudan"});
            // Assessment.create({assessment_ID: "CM-2015-FU", ISO3: "CMR", year: "2015", country: "Cameroon"});
            // Assessment.create({assessment_ID: "CL-2015-FU", ISO3: "CHL", year: "2015", country: "Chile"});
            // Assessment.create({assessment_ID: "NE-2015-FU", ISO3: "NER", year: "2015", country: "Niger"});
            // Assessment.create({assessment_ID: "PG-2015-FU", ISO3: "PNG", year: "2015", country: "Papua New Guinea"});
            // Assessment.create({assessment_ID: "MR-2015-FU", ISO3: "MRT", year: "2015", country: "Mauritania"});
            // Assessment.create({assessment_ID: "IN-2015-FU", ISO3: "IND", year: "2015", country: "India"});
            // Assessment.create({assessment_ID: "BR-2015-FU", ISO3: "BRA", year: "2015", country: "Brazil"});
            // Assessment.create({assessment_ID: "ET-2015-FU", ISO3: "ETH", year: "2015", country: "Ethiopia"});
            // Assessment.create({assessment_ID: "VN-2015-FU", ISO3: "VNM", year: "2015", country: "Vietnam"});
            // Assessment.create({assessment_ID: "ZA-2015-FU", ISO3: "ZAF", year: "2015", country: "South Africa"});
            // Assessment.create({assessment_ID: "UG-2015-FU", ISO3: "UGA", year: "2015", country: "Uganda"});
            // Assessment.create({assessment_ID: "CA-2015-FU", ISO3: "CAN", year: "2015", country: "Canada"});
            // Assessment.create({assessment_ID: "MY-2015-FU", ISO3: "MYS", year: "2015", country: "Malaysia"});
            // Assessment.create({assessment_ID: "AU-2015-FU", ISO3: "AUS", year: "2015", country: "Australia"});
            // Assessment.create({assessment_ID: "BF-2015-FU", ISO3: "BFA", year: "2015", country: "Burkina Faso"});
            // Assessment.create({assessment_ID: "ML-2015-FU", ISO3: "MLI", year: "2015", country: "Mali"});
            // Assessment.create({assessment_ID: "SN-2015-FU", ISO3: "SEN", year: "2015", country: "Senegal"});
            // Assessment.create({assessment_ID: "RW-2015-FU", ISO3: "RWA", year: "2015", country: "Rwanda"});
            // Assessment.create({assessment_ID: "GR-2015-FU", ISO3: "GRC", year: "2015", country: "Greece"});
            // Assessment.create({assessment_ID: "BI-2015-FU", ISO3: "BDI", year: "2015", country: "Burundi"});
            // Assessment.create({assessment_ID: "BY-2015-FU", ISO3: "BLR", year: "2015", country: "Belarus"});
            // Assessment.create({assessment_ID: "BG-2015-FU", ISO3: "BGR", year: "2015", country: "Bulgaria"});
            // Assessment.create({assessment_ID: "PY-2015-FU", ISO3: "PRY", year: "2015", country: "Paraguay"});
            // Assessment.create({assessment_ID: "SL-2015-FU", ISO3: "SLE", year: "2015", country: "Sierra Leone"});
            // Assessment.create({assessment_ID: "GE-2015-FU", ISO3: "GEO", year: "2015", country: "Georgia"});
            // Assessment.create({assessment_ID: "CF-2015-FU", ISO3: "CAF", year: "2015", country: "Central African Republic"});
            // Assessment.create({assessment_ID: "BA-2015-FU", ISO3: "BIH", year: "2015", country: "Bosnia and Herzegovina"});
            // Assessment.create({assessment_ID: "LT-2015-FU", ISO3: "LTU", year: "2015", country: "Lithuania"});
            // Assessment.create({assessment_ID: "AM-2015-FU", ISO3: "ARM", year: "2015", country: "Armenia"});
            // Assessment.create({assessment_ID: "AL-2015-FU", ISO3: "ALB", year: "2015", country: "Albania"});
            // Assessment.create({assessment_ID: "JM-2015-FU", ISO3: "JAM", year: "2015", country: "Jamaica"});
            // Assessment.create({assessment_ID: "ID-2015-FU", ISO3: "IDN", year: "2015", country: "Indonesia"});
            // Assessment.create({assessment_ID: "CI-2015-FU", ISO3: "CIV", year: "2015", country: "Cote d'Ivoire"});
            // Assessment.create({assessment_ID: "NA-2015-FU", ISO3: "NAM", year: "2015", country: "Namibia"});
            // Assessment.create({assessment_ID: "BW-2015-FU", ISO3: "BWA", year: "2015", country: "Botswana"});
        }
    });
}

exports.createDefaultAssessments = createDefaultAssessments;