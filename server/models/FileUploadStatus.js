'use strict';

var mongoose                = require('mongoose'),
    FileUploadStatusSchema  = mongoose.Schema({
        completion: {type: Number, default: 0},
        document: {type: mongoose.Schema.Types.ObjectId, ref: 'Documents'}
    });

FileUploadStatusSchema.methods.setCompletion = function(completion) {
    this.completion = completion;
    this.save();
};

FileUploadStatusSchema.methods.setDocument = function(document) {
    this.document = document;
    this.save();
};

module.exports = mongoose.model('FileUploadStatus', FileUploadStatusSchema);
