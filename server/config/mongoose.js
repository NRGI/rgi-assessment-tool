'use strict';
var mongoose = require('mongoose'),
    countryModel = require('../models/Countries'),
    userModel = require('../models/User');

['Answers', 'Assessment', 'Documents', 'Question', 'ResetPasswordToken'].forEach(function(modelName) {
    require('../models/' + modelName);
});

module.exports = function (config, user, pass, env) {
    // connect to mongo

    if (env === 'local') {
        mongoose.connect(config.db);
    } else {
        mongoose.connect('mongodb://' + user + ':' + pass + config.db);
    }

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('rgi db opened');
    });

    // import data
    userModel.createDefaultUsers();
    countryModel.createDefaultCountries();
    //questionModel.createDefaultQuestions();
    // assessmentModel.createDefaultAssessments();
};
