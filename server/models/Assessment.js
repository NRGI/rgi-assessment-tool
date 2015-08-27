'use strict';
/*jslint unparam: true*/

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modified_by: ObjectId,
    modified_date: Date
});


var assessmentSchema = mongoose.Schema({
    assessment_ID: {
        type: String,
        required: '{PATH} is required',
        index: true,
        unique: true}, // ISO2 of country + Year + <pilot, hydrocarbon, mining>
    ISO3: {
        type: String,
        required: '{PATH} is required'}, // ISO3 of country
    country: {
        type: String,
        required: '{PATH} is required'}, // String of country name
    year: {
        type: String,
        required: '{PATH} is required'},
    version: {
        type: String,
        required: '{PATH} is required'},  // pilot or full
    researcher_ID: {
        type: ObjectId,
        index: true}, // pulled from user_id
    reviewer_ID: {
        type: ObjectId,
        index: true}, // pulled from user_id
    edit_control: ObjectId, // user_ID of editing rights
    status: {
        type: String,
        required: '{PATH} is required',
        default: 'unassigned'}, // unassigned, assigned, started, submitted, review, reassigned, approved
    first_pass: {
        type: Boolean,
        default: true},
    assignment: {
        assigned_by: ObjectId,
        assigned_date: Date},
    start_date: {
        started_by: ObjectId,
        started_date: Date},
    submit_date: {
        submitted_by: ObjectId,
        submitted_date: Date},
    review_date: {
        reviewed_by: ObjectId,
        reviewed_date: Date},
    approval: {
        approved_by: ObjectId,
        approved_date: Date},
    modified: [modificationSchema],
    questions_complete: {
        type: Number,
        default: 0},
    questions_flagged: {
        type: Number,
        default: 0},
    questions_resubmitted: {
        type: Number,
        default: 0},
    questions_unfinalized: {
        type: Number,
        required: '{PATH} is required'},
    question_length: {
        type: Number,
        required: '{PATH} is required'}
});

var Assessment = mongoose.model('Assessment', assessmentSchema);
