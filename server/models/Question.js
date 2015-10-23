'use strict';

var mongoose        = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    Schema          = mongoose.Schema;

var options = {customCollectionName: "question_hst"};

var ObjectId = mongoose.Schema.Types.ObjectId;
var Schemalesss = mongoose.Schema.Types.Mixed;
require('mongoose-html').loadType(mongoose);
var Html = mongoose.Types.Html;

var htmlSettings = {
    type: Html,
    setting: {
        allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'del'],
        allowedAttributes: {
            'a': ['href']
        }
    }
};

var modificationSchema = new Schema({
    modifiedBy: Schemalesss, // Pull from curretn user _id value but needs to handle legacy comments
    modifiedDate: {
        type: Date,
        default: Date.now}
});

var commentSchema = new Schema({
    date: {
        type: Date,
        default: Date.now},
    content: htmlSettings,
    author: ObjectId, // Pull from curretn user _id value
    author_name: String,
    role: String,
    addressed: Boolean
});

//var questionSchema = new Schema({
//    year: String,
//    version: String,
//    root_question_ID: ObjectId,
//    assessment_ID: {
//        type: String,
//        required: '{PATH} is required'},
//    question_use: {
//        type: Boolean,
//        default: true},
//    question_order: {
//        type: Number,
//        required: '{PATH} is required'},
//    qid: String,  //combination of ??? (question number column)
//    question_label: String   //labeling schema for questionaire (Question Number (Continuous) column)
//    precept: [Number] ///from precept column
//    component: {
//        type: String,
//        required: '{PATH} is required'}, ///from Governance Component column
//    component_text: {
//        type: String,
//        required: '{PATH} is required'}, ///from Governance Component column
//    indicator: String,  ///from Indicator column
//    dejure: Boolean, ///from "De Jure or De Facto" true=dejure
//    question_text : String, ///from question column
//    question_criteria: [{
//        name: String,
//        order: Number,
//        criteria: String
//    }],  ///from Criterion columns and used to be called question_choices
//    question_dependancies: String, //from question dependancies column points to question label
//    question_guidance_text: String, //from Guidance Notes column
//    mapping_2013: String, ///from Mapping: RGI 2013 column
//    mapping_external: String, ///Mapping: External
//    comments: [commentSchema],
//    modified: [modificationSchema],
//});

var questionSchema = new Schema({
    question_use: {
        type: Boolean,
        default: true},
    question_order: {
        type: Number,
        required: '{PATH} is required'},
    qid: String,
    old_reference: {
        row_id_org: String,
        row_id: String,
        old_rwi_questionnaire_code: String,
        uid: String,
        qid: String,
        indaba_question_order: String,
        component_excel: String,
        jan_2015_questionnaire_id: String,
        original_question_if_changed: String
    },
    component: {
        type: String,
        required: '{PATH} is required'},
    component_text: {
        type: String,
        required: '{PATH} is required'},
    broad_governance: String,
    rgi_mga: String,
    indicator: String,
    guidance_notes: String,
    year: String,
    version: String,
    root_question_ID: ObjectId,
    assessment_ID: {
        type: String,
        required: '{PATH} is required'},
    sub_indicator_namw: String,
    minstry_if_applicable: String,
    section_name: String,
    outcome_primary_q: String,
    child_question: String,
    needs_revision: Boolean,
    question_text : String,
    question_guidance_text: String,
    question_choices: [{
        name: String,
        order: Number,
        criteria: String
    }],
    comments: [commentSchema],
    modified: [modificationSchema],
    precept: [Number]
});

questionSchema.plugin(mongooseHistory, options);

var Question = mongoose.model('Question', questionSchema);

function createDefaultQuestions() {
    Question.find({}).exec(function (err, questions) {
        if (questions.length === 0) {
            Question.create({
                "_id": "561fe604f004cd4715705420",
                "precept" : [ 2 ],
                "indicator" : "EITI in national legislation",
                "question_text" : "Is the EITI ratified in national legislation?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "old_reference" : { "component_excel" : "Quality of legal structure" },
                "question_choices" : [
                    { "criteria" : "Yes", "name" : "criteria_a", "order" : 1 },
                    { "criteria" : "Partial", "name" : "criteria_b", "order" : 2 },
                    { "criteria" : "No", "name" : "criteria_d", "order" : 3 },
                    { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 }
                ],
                "component" : "legal",
                "qid" : 14,
                "assessment_ID" : "base",
                "needs_revision" : true,
                "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)",
                "question_order" : 1,
                "component_text" : "Quality of legal structure",
                "options" : 4
            });
            Question.create({
                "root_question_ID": "561fe604f004cd4715705420",
                "year": "2015",
                "version": "pilot",
                "assessment_ID": "2015-PI",
                "component": "legal",
                "component_text": "Quality of legal structure",
                "indicator": "EITI in national legislation",
                "question_order": 1,
                "question_text": "Is the EITI ratified in national legislation?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "precept": [ 2 ],
                "modified": [],
                "comments": [],
                "question_choices": [
                    {
                        "criteria": "Yes",
                        "name": "criteria_a",
                        "order": 1
                    },
                    {
                        "criteria": "Partial",
                        "name": "criteria_b",
                        "order": 2
                    },
                    {
                        "criteria": "No",
                        "name": "criteria_d",
                        "order": 3
                    },
                    {
                        "criteria": "Not applicable/other. (Explain in 'comments' box.)",
                        "name": "criteria_e",
                        "order": 4
                    }
                ],
                "question_use": true
            });
            Question.create({
                "_id": "561fe604f004cd4715705425",
                "precept" : [ 2 ],
                "indicator" : "Contract Disclosure",
                "question_text" : "Has this country adopted a rule or legisation that requires the publication of all contracts in the oil, gas, and mineral sectors?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "old_reference" : {
                    "original_question_if_changed" : "Are all contracts, agreements or negotiated terms for exploration and production, regardless of the way they are granted, disclosed to the public?",
                    "jan_2015_questionnaire_id" : "68",
                    "component_excel" : "Quality of legal structure"
                },
                "question_choices" : [
                    { "criteria" : "Yes", "name" : "criteria_a", "order" : 1 },
                    { "criteria" : "Partial", "name" : "criteria_b", "order" : 2 },
                    { "criteria" : "No", "name" : "criteria_d", "order" : 3 },
                    { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 }
                ],
                "component" : "legal",
                "qid" : 15,
                "assessment_ID" : "base",
                "needs_revision" : true,
                "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)",
                "question_order" : 2,
                "component_text" : "Quality of legal structure",
                "options" : 4
            });
            Question.create({
                "root_question_ID": "561fe604f004cd4715705425",
                "year": "2015",
                "version": "pilot",
                "assessment_ID": "2015-PI",
                "component": "legal",
                "component_text": "Quality of legal structure",
                "indicator": "Contract Disclosure",
                "question_order": 2,
                "question_text": "Has this country adopted a rule or legisation that requires the publication of all contracts in the oil, gas, and mineral sectors?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "precept": [ 2 ],
                "modified": [],
                "comments": [],
                "question_choices": [
                    {
                        "criteria": "Yes",
                        "name": "criteria_a",
                        "order": 1
                    },
                    {
                        "criteria": "Partial",
                        "name": "criteria_b",
                        "order": 2
                    },
                    {
                        "criteria": "No",
                        "name": "criteria_d",
                        "order": 3
                    },
                    {
                        "criteria": "Not applicable/other. (Explain in 'comments' box.)",
                        "name": "criteria_e",
                        "order": 4
                    }
                ],
                "question_use": true
            });
            Question.create({
                "_id": "561fe604f004cd471570542a",
                "precept" : [ 2 ],
                "indicator" : "Contract Disclosure",
                "question_text" : "Have all contracts between extraction companies and the government been disclosed?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "old_reference" : { "component_excel" : "Reporting practice" },
                "question_choices" : [
                    { "criteria" : "Yes, in pdf, online.", "name" : "criteria_a", "order" : 1 },
                    { "criteria" : "Yes, but only physical copies", "name" : "criteria_b", "order" : 2 },
                    { "criteria" : "No", "name" : "criteria_d", "order" : 3 },
                    { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 }
                ],
                "component" : "reporting",
                "assessment_ID" : "base",
                "needs_revision" : false,
                "question_order" : 3,
                "component_text" : "Reporting practice",
                "options" : 4
            });
            Question.create({
                "root_question_ID": "561fe604f004cd471570542a",
                "year": "2015",
                "version": "pilot",
                "assessment_ID": "2015-PI",
                "component": "reporting",
                "component_text": "Reporting practice",
                "indicator": "Contract Disclosure",
                "question_order": 3,
                "question_text": "Have all contracts between extraction companies and the government been disclosed?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "precept": [ 2 ],
                "modified": [],
                "comments": [],
                "question_choices": [
                    {
                        "criteria": "Yes, in pdf, online.",
                        "name": "criteria_a",
                        "order": 1
                    },
                    {
                        "criteria": "Yes, but only physical copies",
                        "name": "criteria_b",
                        "order": 2
                    },
                    {
                        "criteria": "No",
                        "name": "criteria_d",
                        "order": 3
                    },
                    {
                        "criteria": "Not applicable/other. (Explain in 'comments' box.)",
                        "name": "criteria_e",
                        "order": 4
                    }
                ],
                "question_use": true
            });
            Question.create({
                "_id": "561fe604f004cd471570542f",
                "precept" : [ 2 ],
                "indicator" : "Freedom of Information law applied",
                "question_text" : "Do citizens request and successfully receive information using the freedom of information law?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "old_reference" : { "component_excel" : "Oversight" },
                "question_choices" : [
                    { "criteria" : "Yes", "name" : "criteria_a", "order" : 1 },
                    { "criteria" : "Partial", "name" : "criteria_b", "order" : 2 },
                    { "criteria" : "No", "name" : "criteria_d", "order" : 3 },
                    { "criteria" : "Not applicable/other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 }
                ],
                "component" : "oversight",
                "qid" : 16,
                "assessment_ID" : "base",
                "needs_revision" : false,
                "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)",
                "question_order" : 4,
                "component_text" : "Oversight",
                "options" : 4
            });
            Question.create({
                "root_question_ID": "561fe604f004cd471570542f",
                "year": "2015",
                "version": "pilot",
                "assessment_ID": "2015-PI",
                "component": "oversight",
                "component_text": "Oversight",
                "indicator": "Freedom of Information law applied",
                "question_order": 4,
                "question_text": "Do citizens request and successfully receive information using the freedom of information law?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "precept": [ 2 ],
                "modified": [],
                "comments": [],
                "question_choices": [
                    {
                        "criteria": "Yes",
                        "name": "criteria_a",
                        "order": 1
                    },
                    {
                        "criteria": "Partial",
                        "name": "criteria_b",
                        "order": 2
                    },
                    {
                        "criteria": "No",
                        "name": "criteria_d",
                        "order": 3
                    },
                    {
                        "criteria": "Not applicable/other. (Explain in 'comments' box.)",
                        "name": "criteria_e",
                        "order": 4
                    }
                ],
                "question_use": true
            });
            Question.create({
                "_id": "561fe604f004cd4715705434",
                "precept" : [ 2 ],
                "indicator" : "EITI report",
                "question_text" : "Has this country published an EITI report?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "old_reference" : {
                    "jan_2015_questionnaire_id" : "64",
                    "component_excel" : "Reporting practice"
                },
                "question_choices" : [
                    { "criteria" : "The country has published an EITI report, including information on national revenue classification systems and international standards, such as the IMF Government Finance Statistics Manual; a summary of national audit procedures (including an analysis of whether audit procedures meet international standards); information about the contribution of the extractive industries to the economy for the year covered (including: size of the extractive industries in absolute terms, size of the extractive industries as percentage of GDP, an estimate of informal sector activity); exports from the extractive industries in absolute terms; exports from the extractive industries as percentage of total exports.", "name" : "criteria_a", "order" : 1 },
                    { "criteria" : "The country has published an EITI report, but some essential information (described in full in Answer A) is missing (please explain).", "name" : "criteria_b", "order" : 2 },
                    { "criteria" : "The country has published an EITI report with only scant information.", "name" : "criteria_c", "order" : 3 },
                    { "criteria" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 4 },
                    { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 5 }
                ],
                "component" : "reporting",
                "qid" : 17,
                "assessment_ID" : "base",
                "needs_revision" : false,
                "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)",
                "guidance_notes" : "Record link to document.",
                "question_order" : 5,
                "component_text" : "Reporting practice",
                "options" : 5
            });
            Question.create({
                "root_question_ID": "561fe604f004cd4715705434",
                "year": "2015",
                "version": "pilot",
                "assessment_ID": "2015-PI",
                "component": "reporting",
                "component_text": "Reporting practice",
                "indicator": "EITI report",
                "question_order": 5,
                "question_text": "Has this country published an EITI report?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "precept": [ 2 ],
                "modified": [],
                "comments": [],
                "question_choices": [
                    {
                        "criteria": "The country has published an EITI report, including information on national revenue classification systems and international standards, such as the IMF Government Finance Statistics Manual; a summary of national audit procedures (including an analysis of whether audit procedures meet international standards); information about the contribution of the extractive industries to the economy for the year covered (including: size of the extractive industries in absolute terms, size of the extractive industries as percentage of GDP, an estimate of informal sector activity); exports from the extractive industries in absolute terms; exports from the extractive industries as percentage of total exports.",
                        "name": "criteria_a",
                        "order": 1
                    },
                    {
                        "criteria": "The country has published an EITI report, but some essential information (described in full in Answer A) is missing (please explain).",
                        "name": "criteria_b",
                        "order": 2
                    },
                    {
                        "criteria": "The country has published an EITI report with only scant information.",
                        "name": "criteria_c",
                        "order": 3
                    },
                    {
                        "criteria": "The country has not published an EITI report.",
                        "name": "criteria_d",
                        "order": 4
                    },
                    {
                        "criteria": "Not applicable/Other. (Explain in 'comments' box.)",
                        "name": "criteria_e",
                        "order": 5
                    }
                ],
                "question_use": true
            });
            Question.create({
                "_id": "561fe604f004cd471570543a",
                "precept" : [ 2 ],
                "indicator" : "Quality of EITI data",
                "question_text" : "If the country has published an EITI report, does it cover all topics in new standard?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "old_reference" : { "component_excel" : "Reporting practice" },
                "question_choices" : [
                    { "criteria" : "Covers all topics relevant within country context", "name" : "criteria_a", "order" : 1 },
                    { "criteria" : "Only partials resource revenue reconciliation", "name" : "criteria_c", "order" : 2 },
                    { "criteria" : "The country has not published an EITI report.", "name" : "criteria_d", "order" : 3 },
                    { "criteria" : "Not applicable/Other. (Explain in 'comments' box.)", "name" : "criteria_e", "order" : 4 }
                ],
                "component" : "reporting",
                "qid" : 18,
                "assessment_ID" : "base",
                "needs_revision" : false,
                "outcome_primary_q" : "Reporting, oversight and enforcement (precept 2 - Accountability and transparency)",
                "guidance_notes" : "Record link to document.",
                "question_order" : 6,
                "component_text" : "Reporting practice",
                "options" : 4
            });
            Question.create({
                "root_question_ID": "561fe604f004cd471570543a",
                "year": "2015",
                "version": "pilot",
                "assessment_ID": "2015-PI",
                "component": "reporting",
                "component_text": "Reporting practice",
                "indicator": "Quality of EITI data",
                "question_order": 6,
                "question_text": "If the country has published an EITI report, does it cover all topics in new standard?",
                "question_guidance_text": "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.",
                "precept": [ 2 ],
                "modified": [],
                "comments": [],
                "question_choices": [
                    {
                        "criteria": "Covers all topics relevant within country context",
                        "name": "criteria_a",
                        "order": 1
                    },
                    {
                        "criteria": "Only partials resource revenue reconciliation",
                        "name": "criteria_c",
                        "order": 2
                    },
                    {
                        "criteria": "The country has not published an EITI report.",
                        "name": "criteria_d",
                        "order": 3
                    },
                    {
                        "criteria": "Not applicable/Other. (Explain in 'comments' box.)",
                        "name": "criteria_e",
                        "order": 4
                    }
                ],
                "question_use": true
            });
        }
    });
}

exports.createDefaultQuestions = createDefaultQuestions;
