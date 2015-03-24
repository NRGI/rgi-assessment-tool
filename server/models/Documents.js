var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var documentSchema = mongoose.Schema({
    file_hash: String,
    mendeley_ID: String,
    mendeley_endpoint: String,
    aws_endpoint: String,
    title: String,
    uploaded_date: {type:Date, default: Date.now},
    uploaded_by: ObjectId,
    referenced: Array
});

var Documents = mongoose.model('Documents', documentSchema);