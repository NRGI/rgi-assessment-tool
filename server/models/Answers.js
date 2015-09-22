'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modifiedBy: ObjectId,
    modifiedDate: {
        type: Date,
        default: Date.now}
});

var commentSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now},
    content: String,
    author: ObjectId, // Pull from curretn user _id value
    author_name: String,
    role: String,
    addressed: Boolean
});

var citationSchema = new mongoose.Schema({
    document_ID: String,
    mendeley_ID: String,
    file_hash: String,
    date: {
        type: Date,
        default: Date.now},
    date_accessed: Date,
    author: ObjectId, // Pull from current user _id value
    author_name: String,
    role: String,
    comment: String
});

var humanSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    phone: String,
    email: String,
    contact_date: {
        type: Date,
        default: Date.now},
    comment: {
        date: {
            type: Date,
            default: Date.now},
        content: String,
        author: ObjectId, // Pull from curretn user _id value
        author_name: String,
        role: String,
        addressed: Boolean
    }
});

var interviewSchema = new mongoose.Schema({
    interviewee_ID: ObjectId,
    contact_date: {
        type: Date,
        default: Date.now},
    comment: {
        date: {
            type: Date,
            default: Date.now},
        content: String,
        author: ObjectId, // Pull from curretn user _id value
        author_name: String,
        role: String,
        addressed: Boolean
    }
});

var scoreHistorySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now},
    order: Number,
    score: Number
    /////ERROR CALCULATION
});

var answerSchema = mongoose.Schema({
    answer_ID: {
        type: String,
        required: '{PATH} is required',
        index: true,
        unique: true}, // combination ISO3 + question_order in Question Model with 2 leading 0's
    assessment_ID: {
        type: String,
        required: '{PATH} is required',
        index: true}, // generated from assessment_ID value of Assessment Model (ISO3 country)
    researcher_ID: {
        type: ObjectId,
        required: '{PATH} is required',
        index: true}, // generated from _id value of User Model
    reviewer_ID: {
        type: ObjectId,
        required: '{PATH} is required',
        index: true}, // generated from _id value of User Model
    year: String,
    version: String,  // pilot or main
    //edit_control: ObjectId, // user_ID of editing rights
    question_order: {
        type: Number,
        required: '{PATH} is required'}, // generated from the order_ID of Question Model
    question_text: String, // 
    component: {
        type: String,
        required: '{PATH} is required'}, // generated from Question Model
    component_text: {
        type: String,
        required: '{PATH} is required'}, // generated from Question Model
    nrc_precept: Number,
    question_ID: {
        type: ObjectId,
        required: '{PATH} is required',
        index: true}, // generated from _id value of Question Model
    root_question_ID: {
        type: ObjectId,
        required: '{PATH} is required',
        index: true}, // generated from _id value of Question Model
    status: {type: String, default: 'assigned'}, // saved, submitted, flagged, reviewed, approved
    flags: [commentSchema],
    assigned: {
        assignedBy: ObjectId,
        assignedDate: {
            type: Date,
            default: Date.now}},
    researcher_score: Number,
    researcher_justification: String,
    /////ERROR CALCULATION
    researcher_score_history: [scoreHistorySchema],
    reviewer_score: Number,
    reviewer_justification: String,
    /////ERROR CALCULATION
    reviewer_score_history: [scoreHistorySchema],
    final_score: Number,
    final_role: String,
    final_justification: String,
    comments: [commentSchema],
    //TODO fix data model to separate human out to interviewees and roll web into citation including screen shot
    references: {
        citation: [citationSchema],
        web: [webSchema],
        human: [humanSchema]
    },
    modified: [modificationSchema]
});

var Answer = mongoose.model('Answer', answerSchema);
