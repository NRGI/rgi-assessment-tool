'use strict';
var mongoose    = require('mongoose');
require('mongoose-html-2').loadType(mongoose);

var commentSchema, citationSchema, interviewSchema, scoreHistorySchema, answerSchema, Answer,
    Question        = mongoose.model('Question'),
    mongooseHistory = require('mongoose-history'),
    Schema          = mongoose.Schema,
    //options         = {customCollectionName: "answer_hst"},
    HTML            = mongoose.Types.Html,
    ObjectId        = mongoose.Schema.Types.ObjectId,
    htmlSettings    = {
        type: HTML,
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
    author: ObjectId, // Pull from curretn user _id value
    author_name: String,
    role: String,
    addressed: Boolean,
    addressed_to: ObjectId
});

citationSchema = new Schema({
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

interviewSchema = new Schema({
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

scoreHistorySchema = new Schema({
    date: {
        type: Date,
        default: Date.now},
    order: Number,
    score: {
        name: String,
        letter: String,
        order: Number,

        text: String,
        value: Number
    },
    justification: String
    /////ERROR CALCULATION
});

answerSchema = new Schema({
    answer_ID: {
        type: String,
        required: '{PATH} is required',
        index: true,
        unique: true}, // combination ISO3 + question_order in Question Model with 2 leading 0's
    assessment_ID: {
        type: String,
        required: '{PATH} is required',
        index: true}, // generated from assessment_ID value of Assessment Model (ISO3 country)
    year: {
        type: String,
        required: '{PATH} is required'},
    version: {
        type: String,
        required: '{PATH} is required'},  // pilot or main
    question_order: {
        type: Number,
        required: '{PATH} is required'}, // generated from the order_ID of Question Model
    question_ID: {
        type: ObjectId,
        required: '{PATH} is required',
        index: true,
        ref: 'Question'}, // generated from _id value of Question Model
    question_v: Number,
    //question_norm: Number, ///Len of options used for normalizations...ignores NAs
    //root_question_ID: {
    //    type: ObjectId,
    //    required: '{PATH} is required',
    //    index: true}, // generated from _id value of Question Model
    status: {type: String, default: 'assigned'}, // saved, submitted, flagged, reviewed, approved
    flags: [commentSchema],
    last_modified: {
        modified_by: ObjectId,
        modified_date: {
            type: Date,
            default: Date.now}},
    researcher_score: {
        name: String,
        letter: String,
        order: Number,
        text: String,
        value: Number
    },
    researcher_justification: htmlSettings,
    /////ERROR CALCULATION
    researcher_score_history: [scoreHistorySchema],
    reviewer_score: {
        name: String,
        letter: String,
        order: Number,
        text: String,
        value: Number
    },
    reviewer_justification: htmlSettings,
    /////ERROR CALCULATION
    reviewer_score_history: [scoreHistorySchema],
    final_score: {
        name: String,
        letter: String,
        order: Number,
        text: String,
        value: Number
    },
    final_role: String,
    final_justification: htmlSettings,
    comments: [commentSchema],
    //TODO fix data model to separate human out to interviewees and roll web into citation including screen shot
    references: {
        citation: [citationSchema],
        human: [interviewSchema]
    }
});

answerSchema.plugin(mongooseHistory);

Answer = mongoose.model('Answer', answerSchema);
