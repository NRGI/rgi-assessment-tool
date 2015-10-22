'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new Schema({
    modifiedBy: ObjectId,
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
    addressed: Boolean,
    addressed_to: ObjectId
});

var citationSchema = new Schema({
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
    comment: htmlSettings,
    location: String
});
//
//var humanSchema = new Schema({
//    first_name: String,
//    last_name: String,
//    phone: String,
//    email: String,
//    contact_date: {
//        type: Date,
//        default: Date.now},
//    comment: {
//        date: {
//            type: Date,
//            default: Date.now},
//        content: htmlSettings,
//        author: ObjectId, // Pull from curretn user _id value
//        author_name: String,
//        role: String,
//        addressed: Boolean
//    }
//});


var interviewSchema = new Schema({
    interviewee_ID: ObjectId,
    contact_date: {
        type: Date,
        default: Date.now},
    date: {
        type: Date,
        default: Date.now},
    comment: htmlSettings,
    author: ObjectId, // Pull from curretn user _id value
    author_name: String,
    author_role: String
});

var scoreHistorySchema = new Schema({
    date: {
        type: Date,
        default: Date.now},
    order: Number,
    score: Number
    /////ERROR CALCULATION
});

var answerSchema = new Schema({
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
        index: true}, // generated from _id value of User Model
    reviewer_ID: {
        type: ObjectId,
        index: true}, // generated from _id value of User Model
    year: {
        type: String,
        required: '{PATH} is required'},
    version: {
        type: String,
        required: '{PATH} is required'},  // pilot or main
    question_order: {
        type: Number,
        required: '{PATH} is required'}, // generated from the order_ID of Question Model
    question_text: {
        type: String,
        required: '{PATH} is required'},
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
    researcher_justification: htmlSettings,
    /////ERROR CALCULATION
    researcher_score_history: [scoreHistorySchema],
    reviewer_score: Number,
    reviewer_justification: htmlSettings,
    /////ERROR CALCULATION
    reviewer_score_history: [scoreHistorySchema],
    final_score: Number,
    final_role: String,
    final_justification: htmlSettings,
    comments: [commentSchema],
    //TODO fix data model to separate human out to interviewees and roll web into citation including screen shot
    references: {
        citation: [citationSchema],
        human: [interviewSchema]
    },
    modified: [modificationSchema]
});

var Answer = mongoose.model('Answer', answerSchema);
