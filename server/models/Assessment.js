'use strict';
/*jslint unparam: true*/

var assessmentSchema, Assessment,
    mongoose        = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    Schema          = mongoose.Schema,
    //options = {customCollectionName: "assessment_hst"},
    ObjectId        = mongoose.Schema.Types.ObjectId,
    user_ref        = {type: ObjectId, ref: 'User'};

assessmentSchema = new Schema({
    assessment_ID: {
        type: String,
        required: '{PATH} is required',
        index: true,
        unique: true}, // ISO2 of country + Year + <pilot, hydrocarbon, mining>
    ISO3: {
        type: String,
        required: '{PATH} is required'}, // ISO3 of country
    deleted: Boolean,
    resubmitted: {type: Boolean, default: false},
    country: {
        type: String,
        required: '{PATH} is required'}, // String of country name
    year: {
        type: String,
        required: '{PATH} is required'},
    version: {
        type: String,
        required: '{PATH} is required'},  // pilot or full
    mineral: {type: String},
    researcher_ID: user_ref, // pulled from user_id
    reviewer_ID: user_ref, // pulled from user_id
    supervisor_ID: [user_ref], // pulled from user_id
    viewer_ID: [user_ref], // pulled from user_id
    ext_reviewer_ID: [user_ref], // pulled from user_id
    edit_control: ObjectId, // user_ID of editing rights
    documents: [{
        type: ObjectId,
        ref: 'Documents'}],
    interviewees: [{
        type: ObjectId,
        ref: 'Interviewees'}],
    status: {
        type: String,
        required: '{PATH} is required',
        default: 'unassigned'}, // unassigned, assigned, trial, started, submitted, review, reassigned, approved
    first_pass: {
        type: Boolean,
        default: true},
    created: {
        created_by: user_ref,
        created_date: {
            type: Date,
            default: Date.now}},
    assignment_date: {
        user: user_ref,
        date: Date},
    researcher_start_date: {
        user: user_ref,
        date: Date},
    reviewer_start_date: {
        user: user_ref,
        date: Date},
    researcher_submit_date: {
        user: user_ref,
        date: Date},
    reviewer_submit_date: {
        user: user_ref,
        date: Date},
    last_review_date: {
        user: user_ref,
        date: Date},
    approval_date: {
        user: user_ref,
        date: Date},
    last_modified: {
        user: user_ref,
        date: Date}
});

assessmentSchema.plugin(mongooseHistory);

Assessment = mongoose.model('Assessment', assessmentSchema);