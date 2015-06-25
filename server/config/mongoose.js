'use strict';
var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    mendelyTokenModel = require('../models/MendeleyToken'),
    questionModel = require('../models/Question'),
    countryModel = require('../models/Countries'),
    answerModel = require('../models/Answers'),
    documentModel = require('../models/Documents'),
    assessmentModel = require('../models/Assessment');

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
    //questionModel.createDefaultQuestions();
    countryModel.createDefaultCountries();
    // assessmentModel.createDefaultAssessments();
};
