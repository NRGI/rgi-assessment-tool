'use strict';
var mongoose            = require('mongoose'),
    userModel           = require('../models/User'),
    countryModel        = require('../models/Countries'),
    questionModel       = require('../models/Question'),
    intervieweeModel    = require('../models/Interviewees');

[
    'Answers',
    'Assessment',
    'AuthLog',
    'Documents',
    'FileUploadStatus',
    'ResetPasswordToken'
].forEach(function(modelName) {
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

    // import default data
    userModel.createDefaultUsers();
    countryModel.createDefaultCountries();
    questionModel.createDefaultQuestions();
    intervieweeModel.createDefaultInterviewees();
    // assessmentModel.createDefaultAssessments();
};
