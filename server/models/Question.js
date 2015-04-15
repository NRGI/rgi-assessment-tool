'use strict';
/*jslint nomen: true unparam: true*/

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
var Schemalesss = mongoose.Schema.Types.Mixed;

var modificationSchema = new mongoose.Schema({
    modifiedBy: Schemalesss, // Pull from curretn user _id value but needs to handle legacy comments
    modifiedDate: {type: Date, default: Date.now}
});

var commentSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    content: String,
    author: Schemalesss, // Pull from curretn user _id value but needs to handle legacy comments
    author_name: String,
    // ACTUAL CHANGE
    role: String
});

var questionSchema = mongoose.Schema({
    question_order: {type: Number, required: '{PATH} is required'},
    old_reference: {
        row_id_org: String,
        row_id: String,
        old_rwi_questionnaire_code: String,
        uid: String,
        qid: String,
        indaba_question_order: String,
        component_excel: String
    },
    component: {type: String, required: '{PATH} is required'},
    component_text: {type: String, required: '{PATH} is required'},
    indicator_name: String,
    year: String,
    version: String,
    root_question_ID: ObjectId,
    assessment_ID: {type: String, required: '{PATH} is required'},
    sub_indicator_name: String,
    minstry_if_applicable: String,
    section_name: String,
    child_question: String,
    question_text : String,
    question_choices: [
        {
            name: String,
            order: Number,
            criteria: String
        }
    ],
    comments: [commentSchema],
    modified: [modificationSchema],
    nrc_precept: Number
});

var Question = mongoose.model('Question', questionSchema);

function createDefaultQuestions() {
    Question.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            Question.create({"assessment_ID": "base", "nrc_precept": 1, "question_text": "Does the country have a clear legal definition of ownership of mineral resources?", "old_reference": {"row_id": "1", "row_id_org": "4", "component_excel": "NULL"}, "indicator_name": "Ownership rights", "ministry": "none", "question_choices": [{"criteria": "The constitution and national laws grant ownership of all mineral resources in the ground to the sovereign state. The legislation does not recognize or guarantee private property rights over resources in the ground.", "name": "choice_1", "order": 1}, {"criteria": "The constitution and national laws recognize or guarantee private property rights over mineral resources in the ground, with the exception of state-owned land.", "name": "choice_2", "order": 2}, {"criteria": "The constitution and national laws give ownership of mineral resources in the ground to subnational governments, agencies or to indigenous groups.", "name": "choice_3", "order": 3}, {"criteria": "The constitution and national laws recognize a mix of ownership rights.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "N/A", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 1, "sub_indicator_name": "NULL", "options": 5});
            Question.create({"assessment_ID": "base", "nrc_precept": 3, "question_text": "Who has the authority to grant hydrocarbon and mineral rights or licenses?", "old_reference": {"row_id": "2", "row_id_org": "5", "component_excel": "NULL"}, "indicator_name": "Licensing Authority", "ministry": "none", "question_choices": [{"criteria": "The ministry of the extractive sector.", "name": "choice_1", "order": 1}, {"criteria": "A technical agency or regulator.", "name": "choice_2", "order": 2}, {"criteria": "A state-owned company.", "name": "choice_3", "order": 3}, {"criteria": "The office of the executive.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "RGI includes EITI - 3.10.a: Report includes a description of the process for transferring or awarding licenses", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}, {"date": null, "content": "ML: The EITI stnadard requires to describe the legal framework and fiscal regime, which includes a description of who has authority to grant licenses.\n\nDMa. Could add a related question on clarity and simplicity of license grant process. \"is there only one authority that grants hydrocarbon and mineral rights and licenses?\"\n\nBut worth checking with Amir whether this is always a good thing. Might want to nuance a bit and ask whether there is no overlapping authority between areas for licensing.", "author_name": "From Excel file 'Comments' column.", "author": "excel_comments"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 2, "sub_indicator_name": "NULL", "options": 5});
            Question.create({"assessment_ID": "base", "nrc_precept": 3, "question_text": "What licensing practices does the government commonly follow?", "old_reference": {"row_id": "3", "row_id_org": "6", "component_excel": "NULL"}, "indicator_name": "Licensing Authority", "ministry": "none", "question_choices": [{"criteria": "The government conducts open bidding rounds with sealed bid process and decision is made against established criteria (e.g. open bidding rounds can be either with fixed royalty rates and taxes but on the basis of work programs and expenditures, or on variable parameters such as bonuses, royalty rates, profit oil splits and cost recovery limits).", "name": "choice_1", "order": 1}, {"criteria": "The government grants mineral rights following direct negotiations.", "name": "choice_2", "order": 2}, {"criteria": "The government follows the rule of \u201cfirst-come, first-served\u201d to grant mineral licenses, while royalties and taxes are set by legislation.", "name": "choice_3", "order": 3}, {"criteria": "This country does not license mineral rights to private companies.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "RGI includes EITI - 3.10.a: Report includes a description of the process for transferring or awarding licenses", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}, {"date": null, "content": "DMa. This question could be improved to reflect my comment above", "author_name": "From Excel file 'Comments' column.", "author": "excel_comments"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 3, "sub_indicator_name": "NULL", "options": 5});
            Question.create({"assessment_ID": "base", "nrc_precept": 4, "question_text": "What is the fiscal system for mineral resources?", "old_reference": {"row_id": "4", "row_id_org": "7", "component_excel": "NULL"}, "indicator_name": "Fiscal System Minerals", "ministry": "none", "question_choices": [{"criteria": "Companies receive licenses or concessions to explore, exploit and sell minerals in exchange for royalties and taxes.", "name": "choice_1", "order": 1}, {"criteria": "Companies sign production sharing agreements that determine payments and sharing of costs and profits with the government.", "name": "choice_2", "order": 2}, {"criteria": "Companies sign service contracts that determine a fee for services delivered to government agencies.", "name": "choice_3", "order": 3}, {"criteria": "There is a mixed system, which allows different agreements, contracts or regimes to take place, depending on the government's objectives.", "name": "choice_4", "order": 4}, {"criteria": "Not applicable/Other. (Explain in 'comments' box.)", "name": "choice_5", "order": 5}], "component": "context", "modified": [{"modifiedBy": "initiated", "modifiedDate": null}], "comments": [{"date": null, "content": "RGI overlaps with EITI - 3.2.a and b: Summary of fiscal regime, including: Level of fiscal devolution; overview of the relevant laws and regulations; Information on the roles and responsibilities of the relevant government agencies/ Reforms currently under way (if applicable)", "author_name": "From Excel file 'EITI' column.", "author": "excel_eiti"}, {"date": null, "content": "DMa. I don\u2019t really see the point in this question.", "author_name": "From Excel file 'Comments' column.", "author": "excel_comments"}], "component_text": "Context", "section_name": "Access to Resources", "question_order": 4, "sub_indicator_name": "NULL", "options": 5});
        }
    });
}

exports.createDefaultQuestions = createDefaultQuestions;