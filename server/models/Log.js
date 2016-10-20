'use strict';

var mongoose = require('mongoose');
/**
 * The schema of the log entry
 * @type {Mongoose.Schema}
 */
module.exports = mongoose.model('Log', mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
}));
