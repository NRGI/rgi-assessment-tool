'use strict';

var mongoose    = require('mongoose');
var ObjectId    = mongoose.Schema.Types.ObjectId;

var mendeleyTokenSchema = mongoose.Schema({
    access_token: {type: String, required: '{PATH} is required'},
    clientId: {type: String, required: '{PATH} is required', unique: true},
    clientSecret: {type: String, required: '{PATH} is required}'},
    createdBy: ObjectId,
    creationDate: {type: Date, default: Date.now},
    expires_in: {type: Number, required: '{PATH} is required'}
});

var MendeleyToken = mongoose.model('MendeleyToken', mendeleyTokenSchema);