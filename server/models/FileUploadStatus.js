'use strict';

var mongoose = require('mongoose'),
    FileUploadStatusSchema = mongoose.Schema({
        completion: {
            type: Number,
            default: 0
        }
    });

FileUploadStatusSchema.methods.setCompletion = function(completion) {
    this.completion = completion;
    this.save();
};

module.exports = mongoose.model('FileUploadStatus', FileUploadStatusSchema);
