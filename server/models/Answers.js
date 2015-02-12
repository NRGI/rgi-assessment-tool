var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modified_by: ObjectId,
    modified_date: {type: Date, default: Date.now}
});

var commentSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    content: String,
    author: ObjectId, // Pull from curretn user _id value
    author_name: String,
    // ACTUAL CHANGE
    role: String
});

var citationSchema = new mongoose.Schema({
    upload_date: {type: Date, default: Date.now},
    upload_URL: String, // generated from upload path in S3
    upload_note: String,
    upload_user_id: ObjectId,
    citation: {
        source_URL: String,
        authors: [{first_name: String, last_name: String}],
        title: String,
        publish_year: String
    },
    note: [commentSchema]
});

var scoreHistorySchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    order: Number,
    score: Number
    /////ERROR CALCULATION
});

var answerSchema = mongoose.Schema({
    answer_ID: {type: String, required: '{PATH} is required', index: true}, // combination ISO3 + question_order in Question Model with 2 leading 0's
    assessment_ID: {type: String, required: '{PATH} is required', index: true}, // generated from assessment_ID value of Assessment Model (ISO3 country)
    researcher_ID: {type: ObjectId, required: '{PATH} is required', index: true}, // generated from _id value of User Model
    reviewer_ID: {type: ObjectId, required: '{PATH} is required', index: true}, // generated from _id value of User Model
    question_order: {type: Number, required: '{PATH} is required'}, // generated from the order_ID of Question Model
    question_text: String, // 
    component_id: {type: String, required: '{PATH} is required'}, // generated from Question Model
    component_text: {type: String, required: '{PATH} is required'}, // generated from Question Model
    nrc_precept: Number,
    question_ID: {type: ObjectId, required: '{PATH} is required', index: true}, // generated from _id value of Question Model
    status: {type: String, default: 'assigned'}, // saved, submitted, reviewed, approved

    assigned: {assignedBy: ObjectId, assignedDate: {type: Date, default: Date.now}},

    researcher_score: Number,
    /////ERROR CALCULATION
    researcher_score_history: [scoreHistorySchema],
    reviewer_score: Number,
    /////ERROR CALCULATION
    reviewer_score_history: [scoreHistorySchema],
    comments: [commentSchema],
    citations: [citationSchema],
    modified: [modificationSchema],
});

var Answer = mongoose.model('Answer', answerSchema);