var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modifiedBy: ObjectId,
    modifiedDate: {type: Date, default: Date.now}
});

var documentSchema = mongoose.Schema({
    mendeley_ID: String,
    file_hash: String,
    s3_url: String,
    metadata: {
        author: String,
        title: String
    },
    assessments: [ObjectId],
    questions: [ObjectId],
    users: [ObjectId],
    modified: [modificationSchema],
    createdBy: ObjectId,
    creationDate: {type: Date, default: Date.now},
});

var Documents = mongoose.model('Documents', documentSchema);