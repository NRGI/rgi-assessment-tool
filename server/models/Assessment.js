'use strict';
/*jslint unparam: true*/

var assessmentSchema, Assessment,
    mongoose        = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    Schema          = mongoose.Schema,
    options = {customCollectionName: "assessment_hst"},
    ObjectId = mongoose.Schema.Types.ObjectId;

assessmentSchema = new Schema({
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
    documents: [ObjectId],
    interviewees: [ObjectId],
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
    last_modified: {
        modified_by: ObjectId,
        modified_date: Date
    }
});

assessmentSchema.plugin(mongooseHistory, options);

Assessment = mongoose.model('Assessment', assessmentSchema);

function createDefaultAssessments() {
    Assessment.find({}).exec(function (err, assessments) {
        if (assessments.length === 0) {
            Assessment.create({
                "assessment_ID": "AF-2015-PI",
                "ISO3": "AFG",
                "year": "2015",
                "version": "pilot",
                "country": "Afghanistan",
                "modified": [],
                "first_pass": true,
                "status": "unassigned",
                "interviewees": [],
                "documents": []
            });
            Assessment.create({
                "assessment_ID": "AL-2015-PI",
                "ISO3": "ALB",
                "year": "2015",
                "version": "pilot",
                "country": "Albania",
                "modified": [],
                "first_pass": true,
                "status": "unassigned",
                "interviewees": [],
                "documents": []
            });
            Assessment.create({
                "assessment_ID": "DZ-2015-PI",
                "ISO3": "DZA",
                "year": "2015",
                "version": "pilot",
                "country": "Algeria",
                "modified": [],
                "first_pass": true,
                "status": "unassigned",
                "interviewees": [],
                "documents": []
            });
            Assessment.create({
                "assessment_ID": "AM-2015-PI",
                "ISO3": "ARM",
                "year": "2015",
                "version": "pilot",
                "country": "Armenia",
                "modified": [],
                "first_pass": true,
                "status": "unassigned",
                "interviewees": [],
                "documents": []
            });
            Assessment.create({
                "assessment_ID": "AO-2015-PI",
                "ISO3": "AGO",
                "year": "2015",
                "version": "pilot",
                "country": "Angola",
                "modified": [],
                "first_pass": true,
                "status": "unassigned",
                "interviewees": [],
                "documents": []
            });
        }
    });
}

exports.createDefaultAssessments = createDefaultAssessments;