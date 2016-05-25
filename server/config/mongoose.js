'use strict';
var mongoose            = require('mongoose'),
    session             = require('express-session'),
    MongoStore          = require('connect-mongo')(session),
    userModel           = require('../models/User'),
    countryModel        = require('../models/Countries'),
    questionModel       = require('../models/Question'),
    intervieweeModel    = require('../models/Interviewees'),
    resourceModel       = require('../models/Resources');

[
    'Documents',
    'Answers',
    'Assessment',
    'AuthLog',
    'FileUploadStatus',
    'ResetPasswordToken'
].forEach(function(modelName) {
        require('../models/' + modelName);
    });

module.exports = function (app, config, user, pass, env) {
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

    // app.use(session({
    //     secret: 'All your base are belong to us',
    //     store: new MongoStore({ mongooseConnection: db }),
    //     resave: true,
    //     saveUninitialized: true
    // }));

    // import default data
    userModel.createDefaultUsers();
    countryModel.createDefaultCountries();
    questionModel.createDefaultQuestions();
    intervieweeModel.createDefaultInterviewees();
    resourceModel.createDefaultResources();
};
