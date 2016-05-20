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
        required: '{PATH} is required',
        unique: true},
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
    dependant: {
        type: Boolean,
        default: false},
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
    question_guidance_text: htmlSettings, //from Guidance Notes column
    question_dependancies: htmlSettings,
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

<<<<<<< HEAD
questionSchema.plugin(mongooseHistory);

Question = mongoose.model('Question', questionSchema);

function createDefaultQuestions() {
    Question.find({}).exec(function (err, questions) {
        if (questions.length === 0 && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'question_staging') {
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
                "component" : "legal",
                "component_text" : "Legal and Regulatory Structure",
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
                "question_guidance_text": "<p><h5>Relevance:</h5><p>This <br> question is important to assess the national tax authority is audited by an independent auditor. Where an independent audit on the tax authority does not occur, this may indicate a presence of corruption, simply from the lack of an independent check on the government tax authority.  <p><h5>Where to look:</h5><p>Where an independent audit office audits the tax authority, evidence can usually be found on either the independent auditor’s website, as evidence of their work, or on the national tax authority’s website, as evidence of their compliance with the requirement to be audited by an independent body.  <p><h5>How to answer:</h5><p>If no evidence of an independent audit being conducted on the national tax authority can be found, researchers should select Criterion E.",
                "question_dependancies": "<p>'Machine-readable' data <br> refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
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
                "question_guidance_text": "<p>'Machine-readable' <br> data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
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
                "question_guidance_text": "<p>'Machine-readable' <br> data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
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
                "question_guidance_text": "<p>'Machine-readable' data<br>  refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
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
                "question_guidance_text": "<p>'Machine-readable' data <br> refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
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
                "question_guidance_text": "<p>'Machine-readable' data <br> refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "question_dependancies": "<p>'Machine-readable' data <br> refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "mapping_2013_num": 1,
                "mapping_2013_text": "Changed: Disaggregated response categories, in previous version, aggregated here. RGI2013.20: Does the Ministry of XX publish periodical information on some or all of the information on revenue generation presented in the table below (in reports or statistical databases)?",
                "mapping_2013_category": "Context",
                "mapping_2013_comp": "Perfect Comparability",
                "mapping_external": "",
                "comments": [],
                last_modified: {"modified_by": "initiated", "modified_date": timestamp}
            });
            console.log('Questions created...');
=======
var Question = mongoose.model('Question', questionSchema);

function createDefaultQuestions() {
    Question.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            Question.create({"precept" : [ 2 ], "indicator" : "EITI in national legislation", "question_text" : "Is the EITI ratified in national legislation?", "old_reference" : { "component_excel" : "Quality of legal structure" }, "question_choices" : [ { "criteria" : "Yes", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Partial", "name" : "criteria_b", "order" : 2 }, { "criteria" : "No", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "legal", "modified" : [ ], "comments" : [  ], "qid" : 14, "assessment_ID" : "base", "needs_revision" : true, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 1, "component_text" : "Quality of legal structure", "options" : 4 });
            Question.create({"precept" : [ 2 ], "indicator" : "Contract Disclosure", "question_text" : "Has this country adopted a rule or legisation that requires the publication of all contracts in the oil, gas, and mineral sectors?", "old_reference" : { "original_question_if_changed" : "Are all contracts, agreements or negotiated terms for exploration and production, regardless of the way they are granted, disclosed to the public?", "jan_2015_questionnaire_id" : "68", "component_excel" : "Quality of legal structure" }, "question_choices" : [ { "criteria" : "Yes", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Partial", "name" : "criteria_b", "order" : 2 }, { "criteria" : "No", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "legal", "modified" : [ ], "comments" : [  ], "qid" : 15, "assessment_ID" : "base", "needs_revision" : true, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 2, "component_text" : "Quality of legal structure", "options" : 4 });
            Question.create({"precept" : [ 2 ], "indicator" : "Contract Disclosure", "question_text" : "Have all contracts between extraction companies and the government been disclosed?", "old_reference" : { "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Yes, in pdf, online.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Yes, but only physical copies", "name" : "criteria_b", "order" : 2 }, { "criteria" : "No", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "reporting", "modified" : [ ], "comments" : [  ], "assessment_ID" : "base", "needs_revision" : false, "question_order" : 3, "component_text" : "Reporting practice", "options" : 4 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Freedom of Information law applied", "question_text" : "Do citizens request and successfully receive information using the freedom of information law?", "old_reference" : { "component_excel" : "Oversight" }, "question_choices" : [ { "criteria" : "Yes", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Partial", "name" : "criteria_b", "order" : 2 }, { "criteria" : "No", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "oversight", "modified" : [ ], "comments" : [ ], "qid" : 16, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 4, "component_text" : "Oversight", "options" : 4 });
            //Question.create({"precept" : [ 2 ], "indicator" : "EITI report", "question_text" : "Has this country published an EITI report?", "old_reference" : { "jan_2015_questionnaire_id" : "64", "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "The country has published an EITI report, including information on national revenue classification systems and international standards, such as the IMF Government Finance Statistics Manual; a summary of national audit procedures (including an analysis of whether audit procedures meet international standards); information about the contribution of the extractive industries to the economy for the year covered (including: size of the extractive industries in absolute terms, size of the extractive industries as percentage of GDP, an estimate of informal sector activity); exports from the extractive industries in absolute terms; exports from the extractive industries as percentage of total exports.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "The country has published an EITI report, but some essential information (described in full in Answer A) is missing (please explain).", "name" : "criteria_b", "order" : 2 }, { "criteria" : "The country has published an EITI report with only scant information.", "name" : "criteria_c", "order" : 3 }, { "criteria" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "reporting", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.494Z"), "content" : "3.7b**", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 17, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "guidance_notes" : "Record link to document.", "question_order" : 5, "component_text" : "Reporting practice", "options" : 5 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Quality of EITI data", "question_text" : "If the country has published an EITI report, does it cover all topics in new standard?", "old_reference" : { "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Covers all topics relevant within country context", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Only includes resource revenue reconciliation", "name" : "criteria_c", "order" : 2 }, { "criteria" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "reporting", "modified" : [ ], "comments" : [ ], "qid" : 18, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "guidance_notes" : "Record link to document.", "question_order" : 6, "component_text" : "Reporting practice", "options" : 4 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Quality of EITI data", "question_text" : "If the country has published an EITI report, does it include project-level reporting", "old_reference" : { "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Project level information available.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "No project level reporting.", "name" : "criteria_c", "order" : 2 }, { "criteria" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "reporting", "modified" : [ ], "comments" : [ ], "qid" : 19, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 7, "component_text" : "Reporting practice", "options" : 4 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Quality of EITI data", "question_text" : "If the country has published an EITI report, is it available within reasonable time lag?", "old_reference" : { "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Yes, within a year of completion of financial year.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "More than 2 year lag.", "name" : "criteria_c", "order" : 2 }, { "criteria" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "reporting", "modified" : [ ], "comments" : [ ], "qid" : 20, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 8, "component_text" : "Reporting practice", "options" : 4 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Quality of EITI data", "question_text" : "If the country has published an EITI report, is it available in machine readable format?", "old_reference" : { "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Yes, available to download in Excel and under open data license. Report and data files are coded or tagged .", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Excel file is available alongside PDF", "name" : "criteria_b", "order" : 2 }, { "criteria" : "No. PDF.", "name" : "criteria_c", "order" : 3 }, { "criteria" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "reporting", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.494Z"), "content" : "5.3b Electronic data files are produced along with the report", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 21, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 9, "component_text" : "Reporting practice", "options" : 5 });
            //Question.create({"precept" : [ 1 ], "indicator" : "Data of natural capital accounting", "question_text" : "Does the government disclose comprehensive data on the depletion of its natural capital? (reserves, sales, export)", "old_reference" : { "jan_2015_questionnaire_id" : "82 - 141", "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Yes, the government provides comprehensive information including reserves stock and change, total production/export volume and value for most important commodity.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Either  reserves, volume or value of production of key commodities is not available.", "name" : "criteria_c", "order" : 2 }, { "criteria" : "Information on reserves, volume and value of production/export of key commodities is not available.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "reporting", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "Move to P1", "author_name" : "From Excel file 'design_issues' column.", "author" : "excel_reason" }, { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "needs revision", "author_name" : "From Excel file 'needs_revision' column.", "author" : "excel_reason" }, { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "3.5a,  3.5b -Production and export volumes/values by commodity by state/region (if applicable)", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 22, "assessment_ID" : "base", "needs_revision" : true, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "guidance_notes" : "Record link to document. Record if disclosed in EITI report.", "question_order" : 10, "component_text" : "Reporting practice", "options" : 4 });
            //Question.create({"precept" : [ 1 ], "indicator" : "Data of natural capital accounting", "question_text" : "Does the government disclose disaggregated data on the depletion of its natural capital? (reserves, sales, export)", "old_reference" : { "jan_2015_questionnaire_id" : "82 - 141", "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Yes this information is available for multiple commodities and by state/region where applicable.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "The information is available for one key commodity, but not some other significant commodity with breakdown by state/regione.", "name" : "criteria_b", "order" : 2 }, { "criteria" : "The information is available for one key commodity, but not some other significant commodity with no breakdown by state/region.", "name" : "criteria_c", "order" : 3 }, { "criteria" : "Information on reserves, volume and value of production/export of key commodities is not available.", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "reporting", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "3.5a,  3.5b -Production and export volumes/values by commodity by state/region (if applicable)", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 23, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 11, "component_text" : "Reporting practice", "options" : 5 });
            //Question.create({"precept" : [ 1 ], "indicator" : "Data of natural capital accounting", "question_text" : "Does the government disclose timely data on the depletion of its natural capital? (reserves, sales, export)", "old_reference" : { "jan_2015_questionnaire_id" : "82 - 141", "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Yes, within a year lag.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Over two year lag.", "name" : "criteria_c", "order" : 2 }, { "criteria" : "Information on reserves, volume and value of production/export of key commodities is not available.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "reporting", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "3.5a,  3.5b -Production and export volumes/values by commodity by state/region (if applicable)", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 24, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 12, "component_text" : "Reporting practice", "options" : 4 });
            //Question.create({"precept" : [ 1 ], "indicator" : "Data of natural capital accounting", "question_text" : "Does the government disclose machine readable data on the depletion of its natural capital? (reserves, sales, export)", "old_reference" : { "jan_2015_questionnaire_id" : "82 - 141", "component_excel" : "Reporting practice" }, "question_choices" : [ { "criteria" : "Yes, available to download in Excel and under open data license.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "PDF reporting.", "name" : "criteria_c", "order" : 2 }, { "criteria" : "Information on reserves, volume and value of production/export of key commodities is not available.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "reporting", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "3.5a,  3.5b -Production and export volumes/values by commodity by state/region (if applicable)", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 25, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 13, "component_text" : "Reporting practice", "options" : 4 });
            //Question.create({"precept" : [ 2 ], "indicator" : "EITI participation", "question_text" : "Is the country EITI compliant?", "old_reference" : { "jan_2015_questionnaire_id" : "34", "component_excel" : "Oversight" }, "question_choices" : [ { "criteria" : "The country is EITI compliant.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "The country is an EITI candidate country or has published an EITI report.", "name" : "criteria_b", "order" : 2 }, { "criteria" : "The country is not implementing the EITI and has not expressed interest to implement this initiative.", "name" : "criteria_c", "order" : 3 }, { "criteria" : "The country has been delisted from the EITI process.", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "oversight", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "N/A", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 26, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 14, "component_text" : "Oversight", "options" : 5 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Government disclosure of conflicts of interest", "question_text" : "Are government officials with a role in the oversight of the oil, gas or mining sector required to disclose information about their financial interest in any extractive activities or projects and  is this applied in practice?", "old_reference" : { "jan_2015_questionnaire_id" : "267", "component_excel" : "Oversight" }, "question_choices" : [ { "criteria" : "Yes. Government officials with a role in the oversight of oil, gas or mining sectors are required to disclose information about their participation in extractive activities or projects.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Partial", "name" : "criteria_b", "order" : 2 }, { "criteria" : "No. Government officials are not required to disclose this kind of information.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "oversight", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "We should aslo ask whether this requirement is applied in practice", "author_name" : "From Excel file 'design_issues' column.", "author" : "excel_reason" }, { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "needs revision", "author_name" : "From Excel file 'needs_revision' column.", "author" : "excel_reason" }, { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "N/A", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 27, "assessment_ID" : "base", "needs_revision" : true, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 15, "component_text" : "Oversight", "options" : 4 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Online data portal", "question_text" : "Is there an online data portal where natural resource sector information can be found in one place?", "old_reference" : { "component_excel" : "Oversight" }, "question_choices" : [ { "criteria" : "Yes. It is comprehensive, all data identified in questions below are also available on this portal.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Yes, but limited availability of resource sector data.", "name" : "criteria_b", "order" : 2 }, { "criteria" : "Yes, but resource sector data not included.", "name" : "criteria_c", "order" : 3 }, { "criteria" : "No such portal.", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "oversight", "modified" : [ ], "comments" : [ ], "qid" : 28, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 16, "component_text" : "Oversight", "options" : 5 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Online data portal", "question_text" : "Is the online data portal up to date?", "old_reference" : { "component_excel" : "Oversight" }, "question_choices" : [ { "criteria" : "Yes, data is available with less than a year lag.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "1-2 year lag.", "name" : "criteria_b", "order" : 2 }, { "criteria" : "More than 2 year old data", "name" : "criteria_c", "order" : 3 }, { "criteria" : "No such portal.", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "oversight", "modified" : [ ], "comments" : [ ], "qid" : 29, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 17, "component_text" : "Oversight", "options" : 5 });
            //Question.create({"precept" : [ 2 ], "indicator" : "Online data portal", "question_text" : "Is the online data portal meeting open data standards?", "old_reference" : { "component_excel" : "Oversight" }, "question_choices" : [ { "criteria" : "Yes, data is available through an API, machine readable and has an open license.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Data has either restricted access (limited download) or license.", "name" : "criteria_b", "order" : 2 }, { "criteria" : "Data has restrictive access and license.", "name" : "criteria_c", "order" : 3 }, { "criteria" : "No such portal.", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "oversight", "modified" : [ ], "comments" : [ ], "qid" : 30, "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)", "question_order" : 18, "component_text" : "Oversight", "options" : 5 });
            //Question.create({"precept" : [ 3 ], "indicator" : "Rules defining ownership of data", "question_text" : "Has this country adopted a rule or legisation that requires companies to share geodata with the government?", "old_reference" : { "component_excel" : "Quality of legal structure" }, "question_choices" : [ { "criteria" : "Yes, During exploration a requirement for companies to report quantitative operational information (number of workers employed, metres trenched or drilled, samples taken, etc.) regularly (quarterly, for instance) and for this to be confirmed by external audits annually. Then to release technical information (analytical values, geological/geophysical/geochemical maps, estimated resources, etc.) when an exploration program is terminated, or when application is made to convert part of the license to a mining lease. During mining, regular technical reports should also be made, so as to help determine production levels and taxes due, etc.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Partial, rules exist but do not cover all requirements listed in criteria A.", "name" : "criteria_b", "order" : 2 }, { "criteria" : "No, the coutry does not have a rule requiring sharing of geo data.", "name" : "criteria_d", "order" : 3 }, { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 } ], "component" : "legal", "modified" : [ ], "comments" : [ ], "qid" : 35, "rgi_mga" : "MGA", "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "3.1 Geological Information. Does government manage geological information in a way that enhances competition, improves its negotiating position and manages the resource?", "guidance_notes" : "Evidence: Regulations and guidelines from GSD/MCO/Ministry. \n\nBest practice: During exploration would be a requirement for companies to report quantitative operational information (number of workers employed, metres trenched or drilled, samples taken, etc.) regularly (quarterly, for instance) and for this to be confirmed by external audits annually. Then to release technical information (analytical values, geological/geophysical/geochemical maps, estimated resources, etc.) when an exploration program is terminated, or when application is made to convert part of the license to a mining lease. During mining, regular technical reports should also be made, so as to help determine production levels and taxes due, etc.", "question_order" : 19, "component_text" : "Quality of legal structure", "options" : 4 });
            //Question.create({"precept" : [ 3 ], "indicator" : "Clear and comprehensive license allocation rules", "question_text" : "Does the licensing process specify minimum pre-defined evaluation criteria for all qualified companies?", "old_reference" : { "original_question_if_changed" : "Is the licensing process intended to be open and competitive to all qualified companies?", "jan_2015_questionnaire_id" : "36", "component_excel" : "Quality of legal structure" }, "question_choices" : [ { "criteria" : "Yes. Laws specify minium pre-defined criteria for qualification of companies, and there are not onerous laws prohibiting financially and technically capable companies from seeking qualification.", "name" : "criteria_a", "order" : 1 }, { "criteria" : "Yes. Laws specify minium pre-defined criteria for qualification of companies, BUT there are not onerous laws prohbiting financially and technically capable companies from seeking qualification.", "name" : "criteria_b", "order" : 2 }, { "criteria" : "There are neither minimum qualification criteria, but nor is there onerous laws prohibiting capacble companies", "name" : "criteria_c", "order" : 3 }, { "criteria" : "No. The licensing process or other laws limits participation of qualified companies based on discretionary rules ...", "name" : "criteria_d", "order" : 4 }, { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 } ], "component" : "legal", "modified" : [ ], "comments" : [ { "date" : ISODate("2015-06-23T21:27:39.495Z"), "content" : "3.10a - Report includes a description of the process for transferring or awarding licenses, including:The technical and financial criteria usedInformation about the recipient(s) of the license, including consortium members where applicableAny non-trivial deviations from\nthe applicable legal and regulatory framework governing license transfers and awards", "author_name" : "From Excel file 'eiti' column.", "author" : "excel_reason" } ], "qid" : 38, "rgi_mga" : "RGI", "assessment_ID" : "base", "needs_revision" : false, "outcome_primary_q" : "3.3 Choosing companies. Does the government allocate rights to the most financially and technically competent companies available?", "question_order" : 20, "component_text" : "Quality of legal structure", "options" : 5 });
            //Question.create({"assessment_ID": "base", "precept": 1, "question_text": "Does the country have a clear legal definition of ownership of mineral resources?", "old_reference": {"row_id": "1", "row_id_org": "4", "component_excel": "NULL"}, "indicator_name": "Ownership rights", "ministry": "none", "question_choices": [{"criteria": "The constitution and national laws grant ownership of all mineral resources in the ground to the sovereign state. The legislation does not recognize or guarantee private property rights over resources in the ground.", "name": "choice_1", "order": 1}, {"criteria": "The constitution and national laws recognize or guarantee private property rights over mineral resources in the ground, with the exception of state-owned land.", "name": "choice_2", "order": 2}, {"criteria": "The constitution and national laws give ownership of mineral resources in the ground to subnational governments, agencies or to indigenous groups.", "name": "choice_3", "order": 3}, {"criteria": "The constitution and national laws recognize a mix of ownership rights.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "N/A", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 1, "sub_indicator_name": "NULL", "options": 5});
            //Question.create({"assessment_ID": "base", "precept": 3, "question_text": "Who has the authority to grant hydrocarbon and mineral rights or licenses?", "old_reference": {"row_id": "2", "row_id_org": "5", "component_excel": "NULL"}, "indicator_name": "Licensing Authority", "ministry": "none", "question_choices": [{"criteria": "The ministry of the extractive sector.", "name": "choice_1", "order": 1}, {"criteria": "A technical agency or regulator.", "name": "choice_2", "order": 2}, {"criteria": "A state-owned company.", "name": "choice_3", "order": 3}, {"criteria": "The office of the executive.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "RGI includes EITI - 3.10.a: Report includes a description of the process for transferring or awarding licenses", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}, {"date": null, "content": "ML: The EITI stnadard requires to describe the legal framework and fiscal regime, which includes a description of who has authority to grant licenses.\n\nDMa. Could add a related question on clarity and simplicity of license grant process. \"is there only one authority that grants hydrocarbon and mineral rights and licenses?\"\n\nBut worth checking with Amir whether this is always a good thing. Might want to nuance a bit and ask whether there is no overlapping authority between areas for licensing.", "author_name": "From Excel file 'Comments' column.", "author": "excel_comments"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 2, "sub_indicator_name": "NULL", "options": 5});
            //Question.create({"assessment_ID": "base", "precept": 3, "question_text": "What licensing practices does the government commonly follow?", "old_reference": {"row_id": "3", "row_id_org": "6", "component_excel": "NULL"}, "indicator_name": "Licensing Authority", "ministry": "none", "question_choices": [{"criteria": "The government conducts open bidding rounds with sealed bid process and decision is made against established criteria (e.g. open bidding rounds can be either with fixed royalty rates and taxes but on the basis of work programs and expenditures, or on variable parameters such as bonuses, royalty rates, profit oil splits and cost recovery limits).", "name": "choice_1", "order": 1}, {"criteria": "The government grants mineral rights following direct negotiations.", "name": "choice_2", "order": 2}, {"criteria": "The government follows the rule of \u201cfirst-come, first-served\u201d to grant mineral licenses, while royalties and taxes are set by legislation.", "name": "choice_3", "order": 3}, {"criteria": "This country does not license mineral rights to private companies.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "RGI includes EITI - 3.10.a: Report includes a description of the process for transferring or awarding licenses", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}, {"date": null, "content": "DMa. This question could be improved to reflect my comment above", "author_name": "From Excel file 'Comments' column.", "author": "excel_comments"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 3, "sub_indicator_name": "NULL", "options": 5});
            //Question.create({"assessment_ID": "base", "precept": 4, "question_text": "What is the fiscal system for mineral resources?", "old_reference": {"row_id": "4", "row_id_org": "7", "component_excel": "NULL"}, "indicator_name": "Fiscal System Minerals", "ministry": "none", "question_choices": [{"criteria": "Companies receive licenses or concessions to explore, exploit and sell minerals in exchange for royalties and taxes.", "name": "choice_1", "order": 1}, {"criteria": "Companies sign production sharing agreements that determine payments and sharing of costs and profits with the government.", "name": "choice_2", "order": 2}, {"criteria": "Companies sign service contracts that determine a fee for services delivered to government agencies.", "name": "choice_3", "order": 3}, {"criteria": "There is a mixed system, which allows different agreements, contracts or regimes to take place, depending on the government's objectives.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "RGI overlaps with EITI - 3.2.a and b: Summary of fiscal regime, including: Level of fiscal devolution; overview of the relevant laws and regulations; Information on the roles and responsibilities of the relevant government agencies/ Reforms currently under way (if applicable)", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}, {"date": null, "content": "DMa. I don\u2019t really see the point in this question.", "author_name": "From Excel file 'Comments' column.", "author": "excel_comments"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 4, "sub_indicator_name": "NULL", "options": 5});
>>>>>>> a36829db08c82844e4c05cf309557594404f579b
        }
    });
}

exports.createDefaultQuestions = createDefaultQuestions;
<<<<<<< HEAD








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
=======
>>>>>>> a36829db08c82844e4c05cf309557594404f579b
