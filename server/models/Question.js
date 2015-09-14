'use strict';
/*jslint nomen: true unparam: true*/

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
var Schemalesss = mongoose.Schema.Types.Mixed;

var modificationSchema = new mongoose.Schema({
    modifiedBy: Schemalesss, // Pull from curretn user _id value but needs to handle legacy comments
    modifiedDate: {
        type: Date,
        default: Date.now}
});

var commentSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now},
    content: String,
    author: Schemalesss, // Pull from curretn user _id value but needs to handle legacy comments
    // author: ObjectId, // Pull from curretn user _id value but needs to handle legacy comments
    author_name: String,
    // ACTUAL CHANGE
    role: String
});

var questionSchema = mongoose.Schema({
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
    question_choices: [{
        name: String,
        order: Number,
        criteria: String
    }],
    comments: [commentSchema],
    modified: [modificationSchema],
    precept: [Number]
});

var Question = mongoose.model('Question', questionSchema);

//function createDefaultQuestions() {
//    Question.find({}).exec(function (err, collection) {
//        if (collection.length === 0) {
//            Question.create({});
//        }
//    });
//}
//
//exports.createDefaultQuestions = createDefaultQuestions;
