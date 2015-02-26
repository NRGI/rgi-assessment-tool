'use strict';
var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    questionModel = require('../models/Question'),
    answerModel = require('../models/Answers'),
    assessmentModel = require('../models/Assessment');

module.exports = function (config, user, pass) {
// module.exports = function(config) {
    // connect to mongodb
    // mongoose.connect(config.db);
    console.log(user);
    console.log(pass);
    mongoose.connect('mongodb://' + user + ':' + pass + config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('rgi2015 db opened');
    });

    userModel.createDefaultUsers();
    // answerModel.createDefaultAnswers();
    // questionModel.createDefaultQuestions();
    assessmentModel.createDefaultAssessments();

};