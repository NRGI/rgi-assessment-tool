'use strict';

var mongoose = require('mongoose'),
    AuthLogSchema = mongoose.Schema({
        'action': String,
        'date-time': Date,
        'user': mongoose.Schema.Types.ObjectId
    });

AuthLogSchema.statics.getNumber = function(userId, callback) {
    this.count({user: userId}, callback);
};

AuthLogSchema.statics.list = function(userId, itemsPerPage, page, callback) {
    this.find({user: userId}).sort({'date-time': -1}).skip(page > 0 ? page * itemsPerPage : 0).limit(itemsPerPage)
        .exec(callback);
};

AuthLogSchema.statics.getMostRecent = function(userId, action, callback) {
    this.find({user: userId, action: action}).sort({'date-time': -1}).limit(1)
        .exec(callback);
};

AuthLogSchema.statics.log = function(userId, action) {
    this.create({user: userId, 'date-time': new Date(), action: action});
};

module.exports = mongoose.model('AuthLog', AuthLogSchema);
