'use strict';
/*jslint nomen: true unparam: true*/

var mongoose = require('mongoose'),
    AuthLogSchema = mongoose.Schema({
        'action': String,
        'date-time': Date,
        'user': mongoose.Schema.Types.ObjectId
    });

AuthLogSchema.statics.log = function(userId, action) {
    this.create({user: userId, 'date-time': new Date(), action: action});
};

module.exports = mongoose.model('AuthLog', AuthLogSchema);
