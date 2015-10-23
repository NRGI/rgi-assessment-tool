'use strict';

var mongoose                    = require('mongoose'),
    ResetPasswordTokenSchema    = mongoose.Schema({
        user: mongoose.Schema.Types.ObjectId
    });

ResetPasswordTokenSchema.statics.createByUser = function(userId, callback) {
    this.create({user: userId}, callback);
};

module.exports = mongoose.model('ResetPasswordToken', ResetPasswordTokenSchema);
