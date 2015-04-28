var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modifiedBy: ObjectId,
    modifiedDate: {type: Date, default: Date.now}
});

var authorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String
});

var documentSchema = mongoose.Schema({
    file_hash: String,
    s3_url: String,
    mendeley_ID: String,
    mendeley_url: String,
    title: String,
    authors: [authorSchema],
    type: String,
    source: String,
    year: String,
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
    assessments: [String],
    questions: [ObjectId],
    answers: [String],
    users: [ObjectId],
    modified: [modificationSchema],
    createdBy: ObjectId,
    creationDate: {type: Date, default: Date.now},
    status: {type: String, default: 'created'}
});

var Documents = mongoose.model('Documents', documentSchema);