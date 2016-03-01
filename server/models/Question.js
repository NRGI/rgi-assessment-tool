'use strict';
var mongoose        = require('mongoose');
require('mongoose-html-2').loadType(mongoose);

var commentSchema, questionSchema, Question,
    mongooseHistory = require('mongoose-history'),
    Schema          = mongoose.Schema,
    ObjectId        = mongoose.Schema.Types.ObjectId,
    Schemaless      = mongoose.Schema.Types.Mixed,
    Html            = mongoose.Types.Html,
    enu = {
        values: 'scored context shadow'.split(' '),
        message: 'Validator failed for `{PATH}` with value `{VALUE}`. Please select scored, context, or shadow.'
    },
    htmlSettings    = {
        type: Html,
        setting: {
            allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'del'],
            allowedAttributes: {
                'a': ['href']
            }
        }
    };

commentSchema = new Schema({
    date: {
        type: Date,
        default: Date.now},
    content: htmlSettings,
    author: ObjectId, // Pull from current user _id value
    author_name: String,
    role: String,
    addressed: Boolean
});

questionSchema = new Schema({
    version: String,
    root_question_ID: ObjectId,
    assessments: [String],
    assessment_ID: {
        type: String,
        required: '{PATH} is required'},
    question_use: {
        type: Boolean,
        default: true},
    question_order: {
        type: Number,
        required: '{PATH} is required'},
    question_v: {
        type: Number,
        default: 0},
    question_type: {
        type: String,
        enum: enu,
        required: '{PATH} is required'},
    //qid: String,  //combination of ??? (question number column)
    question_label: String,   //labeling schema for questionaire (Question Number (Continuous) column)
    precept: Number, ///from precept column
    component: {
        type: String,
        required: '{PATH} is required'}, ///from Governance Component column
    component_text: {
        type: String,
        required: '{PATH} is required'}, ///from Governance Component column
    indicator: String,  ///from Indicator column
    dejure: Boolean, ///from "De Jure or De Facto" true=dejure
    linkedOption: ObjectId,
    question_text : String, ///from question column
    question_trial: Boolean,
    question_criteria: [{
        name: String,
        letter: String,
        order: Number,
        text: String,
        value: Number
    }],  ///from Criterion columns and used to be called question_choices
    question_norm: Number, ///Len of options used for normalizations...ignores NAs
    question_dependancies: {
        dependancies: [ObjectId], //from question dependancies column points to question label
        trigger: String, //option that hides and scores
        target_score: String
    },
    question_guidance_text: htmlSettings, //from Guidance Notes column
    mapping_2013_num: String, ///from Mapping: RGI 2013 column
    mapping_2013_text: String,
    mapping_2013_category: String,
    mapping_2013_comp: String,
    mapping_external: String, ///Mapping: External
    comments: [commentSchema],
    last_modified: {
        modified_by: Schemaless, // Pull from curretn user _id value but needs to handle legacy comments
        modified_date: {
            type: Date,
            default: Date.now}}
});

questionSchema.plugin(mongooseHistory);

Question = mongoose.model('Question', questionSchema);

function createDefaultQuestions() {
    Question.find({}).exec(function (err, questions) {
        if (questions.length === 0) {
            var timestamp = new Date().toISOString();
            Question.create({
                "_id": "561fe604f004cd4715705420",
                "assessment_ID" : "base",
                "assessments" : [],
                "question_use": true,
                "question_order" : 1,
                "question_type": "context",
                "question_label": "1.a",
                "precept": 2,
                "component" : "context",
                "component_text" : "Context",
                "indicator" : "EITI in national legislation",
                "dejure": true,
                "question_text" : "Is the EITI ratified in national legislation?",
                "question_trial": true,
                "question_criteria": [
                    { "text": "Yes", "name": "criteria_a", "letter": "a", "order": 1, value: 1 },
                    { "text": "Partial", "name": "criteria_b", "letter": "b", "order": 2 , value: 2},
                    { "text": "No", "name": "criteria_d", "letter": "c", "order": 3 , value: 3},
                    { "text": "Not applicable/other. (Explain in 'comments' box.)", "name": "criteria_e", "letter": "d", "order": 4 , value: -999}
                ],
                "question_norm": 3,
                "question_dependancies": [],
                "question_guidance_text": "<p><h5>Relevance:</h5><p>This question is important to assess the national tax authority is audited by an independent auditor. Where an independent audit on the tax authority does not occur, this may indicate a presence of corruption, simply from the lack of an independent check on the government tax authority.  <p><h5>Where to look:</h5><p>Where an independent audit office audits the tax authority, evidence can usually be found on either the independent auditor’s website, as evidence of their work, or on the national tax authority’s website, as evidence of their compliance with the requirement to be audited by an independent body.  <p><h5>How to answer:</h5><p>If no evidence of an independent audit being conducted on the national tax authority can be found, researchers should select Criterion E.",
                "mapping_2013_num": 1,
                "mapping_2013_text": "Changed: Disaggregated response categories, in previous version, aggregated here. RGI2013.20: Does the Ministry of XX publish periodical information on some or all of the information on revenue generation presented in the table below (in reports or statistical databases)?",
                "mapping_2013_category": "Context",
                "mapping_2013_comp": "Perfect Comparability",
                "mapping_external": "EITI: 3.5a,  3.5b -Production and export volumes/values by commodity by state/region (if applicable)",
                "comments": [],
                last_modified: {"modified_by": "initiated", "modified_date": timestamp}
            });
            Question.create({
                "_id": "561fe604f004cd4715705425",
                "assessment_ID" : "base",
                "assessments" : [],
                "question_use": true,
                "question_order" : 2,
                "question_type": "shadow",
                "question_label": "1.b",
                "precept" : 3,
                "component" : "legal",
                "component_text" : "Legal and Regulatory Structure",
                "indicator" : "Contract Disclosure",
                "dejure": false,
                "question_text" : "Has this country adopted a rule or legisation that requires the publication of all contracts in the oil, gas, and mineral sectors?",
                "question_trial": true,
                "question_criteria" : [
                    { "text" : "Yes", "name" : "criteria_a", "letter": "a", "order" : 1, value: 1},
                    { "text" : "Partial", "name" : "criteria_b", "letter": "b", "order" : 2, value: 2 },
                    { "text" : "No", "name" : "criteria_d", "letter": "c", "order" : 3, value: 3 },
                    { "text" : "Not applicable/other. (Explain in 'comments' box.)", "letter": "d", "name" : "criteria_e", "order" : 4, value: -999 }
                ],
                "question_norm": 3,
                "question_dependancies": [],
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "mapping_2013_num": 1,
                "mapping_2013_text": "Changed: Disaggregated response categories, in previous version, aggregated here. RGI2013.20: Does the Ministry of XX publish periodical information on some or all of the information on revenue generation presented in the table below (in reports or statistical databases)?",
                "mapping_2013_category": "Context",
                "mapping_2013_comp": "Perfect Comparability",
                "mapping_external": "",
                "comments": [],
                last_modified: {"modified_by": "initiated", "modified_date": timestamp}
            });
            Question.create({
                "_id": "561fe604f004cd471570542a",
                "assessment_ID" : "base",
                "assessments" : [],
                "question_use": true,
                "question_order" : 3,
                "question_type": "scored",
                "question_label": "2",
                "precept": 3,
                "component" : "oversight",
                "component_text" : "Oversight and Compliance",
                "indicator" : "Contract Disclosure",
                "dejure": true,
                "question_text" : "Have all contracts between extraction companies and the government been disclosed?",
                "question_trial": false,
                "question_criteria" : [
                    { "text" : "Yes, in pdf, online.", "name" : "criteria_a", "letter": "a", "order" : 1, value: 1 },
                    { "text" : "Yes, but only physical copies", "name" : "criteria_b", "letter": "b", "order" : 2, value: 2 },
                    { "text" : "No", "name" : "criteria_d", "letter": "c", "order" : 3, value: 3 },
                    { "text" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "letter": "d", "order" : 4, value: -999 }
                ],
                "question_norm": 3,
                "question_dependancies": [],
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "mapping_2013_num": 1,
                "mapping_2013_text": "Changed: Disaggregated response categories, in previous version, aggregated here. RGI2013.20: Does the Ministry of XX publish periodical information on some or all of the information on revenue generation presented in the table below (in reports or statistical databases)?",
                "mapping_2013_category": "Context",
                "mapping_2013_comp": "Perfect Comparability",
                "mapping_external": "",
                "comments": [],
                last_modified: {"modified_by": "initiated", "modified_date": timestamp}
            });
            Question.create({
                "_id": "561fe604f004cd471570542f",
                "assessment_ID" : "base",
                "assessments" : [],
                "question_use": true,
                "question_order" : 4,
                "question_type": "scored",
                "question_label": "3.a",
                "precept": 3,
                "component" : "reporting",
                "component_text" : "Reporting and Disclosure Practices",
                "indicator" : "Freedom of Information law applied",
                "dejure": true,
                "question_text" : "Do citizens request and successfully receive information using the freedom of information law?",
                "question_trial": false,
                "question_criteria" : [
                    { "text" : "Yes", "name" : "criteria_a", "letter": "a", "order" : 1, value: 1 },
                    { "text" : "Partial", "name" : "criteria_b", "letter": "b", "order" : 2, value: 2 },
                    { "text" : "No", "name" : "criteria_d", "letter": "c", "order" : 3, value: 3 },
                    { "text" : "Not applicable/other. (Explain in 'comments' box.)", "letter": "d", "name" : "criteria_e", "order" : 4, value: -999 }
                ],
                "question_norm": 3,
                "question_dependancies": [],
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "mapping_2013_num": 1,
                "mapping_2013_text": "Changed: Disaggregated response categories, in previous version, aggregated here. RGI2013.20: Does the Ministry of XX publish periodical information on some or all of the information on revenue generation presented in the table below (in reports or statistical databases)?",
                "mapping_2013_category": "Context",
                "mapping_2013_comp": "Perfect Comparability",
                "mapping_external": "",
                "comments": [],
                last_modified: {"modified_by": "initiated", "modified_date": timestamp}
            });

            Question.create({
                "_id": "561fe604f004cd4715705434",
                "assessment_ID" : "base",
                "assessments" : [],
                "question_use": true,
                "question_order" : 5,
                "question_type": "context",
                "question_label": "3.b",
                "precept": 2,
                "component" : "reporting",
                "component_text" : "Reporting and Disclosure Practices",
                "indicator" : "EITI report",
                "dejure": true,
                "question_text" : "Has this country published an EITI report?",
                "question_trial": false,
                "question_criteria" : [
                    { "letter": "a", "text" : "The country has published an EITI report, including information on national revenue classification systems and international standards, such as the IMF Government Finance Statistics Manual; a summary of national audit procedures (including an analysis of whether audit procedures meet international standards); information about the contribution of the extractive industries to the economy for the year covered (including: size of the extractive industries in absolute terms, size of the extractive industries as percentage of GDP, an estimate of informal sector activity); exports from the extractive industries in absolute terms; exports from the extractive industries as percentage of total exports.", "name" : "criteria_a", "order" : 1, value: 1 },
                    { "letter": "b", "text" : "The country has published an EITI report, but some essential information (described in full in Answer A) is missing (please explain).", "name" : "criteria_b", "order" : 2, value: 2 },
                    { "letter": "c", "text" : "The country has published an EITI report with only scant information.", "name" : "criteria_c", "order" : 3, value: 3 },
                    { "letter": "d", "text" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 4, value: 4 },
                    { "letter": "e", "text" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5, value: -999 }
                ],
                "question_norm": 4,
                "question_dependancies": [],
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "mapping_2013_num": 1,
                "mapping_2013_text": "Changed: Disaggregated response categories, in previous version, aggregated here. RGI2013.20: Does the Ministry of XX publish periodical information on some or all of the information on revenue generation presented in the table below (in reports or statistical databases)?",
                "mapping_2013_category": "Context",
                "mapping_2013_comp": "Perfect Comparability",
                "mapping_external": "",
                "comments": [],
                last_modified: {"modified_by": "initiated", "modified_date": timestamp}
            });
            Question.create({
                "_id": "561fe604f004cd471570543a",
                "assessment_ID" : "base",
                "assessments" : [],
                "question_use": true,
                "question_order" : 6,
                "question_type": "shadow",
                "question_label": "3.c",
                "precept": 4,
                "component" : "reporting",
                "component_text" : "Reporting practice",
                "indicator" : "Quality of EITI data",
                "dejure": true,
                "question_text" : "If the country has published an EITI report, does it cover all topics in new standard?",
                "question_trial": false,
                "question_criteria" : [
                    { "letter": "a", "text" : "Covers all topics relevant within country context", "name" : "criteria_a", "order" : 1, value: 1 },
                    { "letter": "b", "text" : "Only partials resource revenue reconciliation", "name" : "criteria_c", "order" : 2, value: 2 },
                    { "letter": "c", "text" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 3, value: 3 },
                    { "letter": "d", "text" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4, value: -999 }
                ],
                "question_norm": 3,
                "question_dependancies": [],
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "mapping_2013_num": 1,
                "mapping_2013_text": "Changed: Disaggregated response categories, in previous version, aggregated here. RGI2013.20: Does the Ministry of XX publish periodical information on some or all of the information on revenue generation presented in the table below (in reports or statistical databases)?",
                "mapping_2013_category": "Context",
                "mapping_2013_comp": "Perfect Comparability",
                "mapping_external": "",
                "comments": [],
                last_modified: {"modified_by": "initiated", "modified_date": timestamp}
            });
        }
    });
}

exports.createDefaultQuestions = createDefaultQuestions;








///////OLD DATA MODEL
//var questionSchema = new Schema({
//    question_use: {
//        type: Boolean,
//        default: true},
//    question_order: {
//        type: Number,
//        required: '{PATH} is required'},
//    qid: String,
//    old_reference: {
//        row_id_org: String,
//        row_id: String,
//        old_rwi_questionnaire_code: String,
//        uid: String,
//        qid: String,
//        indaba_question_order: String,
//        component_excel: String,
//        jan_2015_questionnaire_id: String,
//        original_question_if_changed: String
//    },
//    component: {
//        type: String,
//        required: '{PATH} is required'},
//    component_text: {
//        type: String,
//        required: '{PATH} is required'},
//    broad_governance: String,
//    rgi_mga: String,
//    indicator: String,
//    guidance_notes: String,
//    year: String,
//    version: String,
//    root_question_ID: ObjectId,
//    assessment_ID: {
//        type: String,
//        required: '{PATH} is required'},
//    sub_indicator_namw: String,
//    minstry_if_applicable: String,
//    section_name: String,
//    outcome_primary_q: String,
//    child_question: String,
//    needs_revision: Boolean,
//    question_text : String,
//    question_guidance_text: String,
//    question_choices: [{
//        name: String,
//        order: Number,
//        criteria: String
//    }],
//    comments: [commentSchema],
//    modified: [modificationSchema],
//    precept: [Number]
//});