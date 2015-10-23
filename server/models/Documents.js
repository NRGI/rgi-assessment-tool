'use strict';

var authorSchema, documentSchema, Documents,
    mongoose        = require('mongoose'),
    //mongooseHistory = require('mongoose-history'),
    //options         = {customCollectionName: "document_hst"},
    Schema          = mongoose.Schema,
    ObjectId        = mongoose.Schema.Types.ObjectId,
    modificationSchema = new Schema({
        modifiedBy: ObjectId,
        modifiedDate: {type: Date, default: Date.now}
    });

authorSchema = new Schema({
    first_name: String,
    last_name: String
});

documentSchema = new Schema({
    file_hash: {
        type: String,
        required: '{PATH} is required!'},
    s3_url: {
        type: String,
        required: '{PATH} is required!'},
    mendeley_ID: String,
    mendeley_url: String,
    //document metadata
    title: String,
    authors: [authorSchema],
    type: String,
    source: String,
    year: String,
    date_published: Date,
    pages: String,
    volume: String,
    issue: String,
    websites: String,
    publisher: String,
    city: String,
    edition: String,
    institution: String,
    series: String,
    chapter: String,
    editors: [authorSchema],
    country: String,
    translators: String,
    series_editor: String,
    //tool mapping
    assessments: [String],
    questions: [ObjectId],
    answers: [String],
    users: [ObjectId],
    mime_type: String,
    modified: [modificationSchema],
    createdBy: ObjectId,
    creationDate: {
        type: Date,
        default: Date.now},
    status: {
        type: String,
        default: 'created'}
});

//documentSchema.plugin(mongooseHistory, options);

Documents = mongoose.model('Documents', documentSchema);