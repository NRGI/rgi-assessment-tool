'use strict';

var mongoose = require('mongoose'),
    AuthLogSchema = mongoose.Schema({
        'action': String,
        'date-time': Date,
        'user': mongoose.Schema.Types.ObjectId
    });

AuthLogSchema.statics.log = function(userId, action) {
    this.create({user: userId, 'date-time': new Date(), action: action});
};

AuthLogSchema.statics.getNumber = function(userId, callback) {
    this.count({user: userId}, callback);
};

module.exports = mongoose.model('AuthLog', AuthLogSchema);
