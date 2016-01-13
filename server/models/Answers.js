'use strict';
var mongoose    = require('mongoose');
require('mongoose-html-2').loadType(mongoose);

var commentSchema, referenceSchema, interviewSchema, scoreHistorySchema, answerSchema, Answer,
    Question        = mongoose.model('Question'),
    User            = mongoose.model('User'),
    Documents             = mongoose.model('Documents'),
    Interviewee    = mongoose.model('Interviewee'),
    mongooseHistory = require('mongoose-history'),
    Schema          = mongoose.Schema,
    //options         = {customCollectionName: "answer_hst"},
    HTML            = mongoose.Types.Html,
    ObjectId        = mongoose.Schema.Types.ObjectId,
    citation_enu    = {
        values: 'interview document'.split(' '),
        message: 'Validator failed for `{PATH}` with value `{VALUE}`. Please select website, interview, or document.'
    },
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
    author: {
        type: ObjectId,
        ref: 'User'},
    addressed: Boolean,
    //TODO see if we need to use populate
    addressed_to: {
        type: ObjectId,
        ref: 'User'}
});

referenceSchema = new Schema({
    citation_type: {
        type: String,
        enum: citation_enu},
    document_ID: {
        type: ObjectId,
        ref: 'Documents'},
    interviewee_ID: {
        type: ObjectId,
        ref: 'Interviewee'},
    //Documents/websites
    mendeley_ID: String,
    file_hash: String,
    date_accessed: {
        type: Date,
        default: Date.now},
    //Interviews
    contact_date: {
        type: Date,
        default: Date.now},
    date: {
        type: Date,
        default: Date.now},
    author: {
        type: ObjectId,
        ref: 'User'},
    comment: htmlSettings,
    location: String
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
    references: [referenceSchema]
});

answerSchema.plugin(mongooseHistory);

Answer = mongoose.model('Answer', answerSchema);
