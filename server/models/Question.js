var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modifiedBy: ObjectId,
    modifiedDate: {type: Date, default: Date.now}
});

var commentSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    content: String,
    author: ObjectId, // Pull from curretn user _id value
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
