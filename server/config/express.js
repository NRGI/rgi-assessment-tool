'use strict';
var express             = require('express'),
    mongoose            = require('mongoose'),
    stylus              = require('stylus'),
    morgan              = require('morgan'),
    bodyParser          = require('body-parser'),
    cookieParser        = require('cookie-parser'),
    session             = require('express-session'),
    MongoStore          = require('connect-mongo')(session),
    passport            = require('passport'),
    logger              = require('../logger/logger'),
    userModel           = require('../models/User'),
    countryModel        = require('../models/Countries'),
    questionModel       = require('../models/Question'),
    intervieweeModel    = require('../models/Interviewees'),
    resourceModel       = require('../models/Resources'),
    SESSION_SECRET	    = "All your base are belong to us";

[
    'Documents',
    'Answers',
    'Assessment',
    'AuthLog',
    'FileUploadStatus',
    'Log',
    'ResetPasswordToken'
].forEach(function(modelName) {
    require('../models/' + modelName);
});

module.exports = function (app, config, user, pass, env) {
    // function for use by stylus middleware
    function compile(str, path) {
        return stylus(str).set('filename', path);
    }
    // set up view engine
    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');
    // set up logger
    app.enable("trust proxy");
    app.use(morgan('short'));
    
    // authentication cofigs
    app.use(cookieParser());

    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    }));

    app.use(bodyParser.json({limit: '50mb'}));

    //Mongoose connection
    if (['local', 'test'].indexOf(env) === -1) {
        mongoose.connect('mongodb://' + user + ':' + pass + config.db);
    } else {
        mongoose.connect(config.db);
    }

    var db = mongoose.connection;
    db.on('error', function() {logger.error('connection error...');});
    db.once('open', function callback() {
        logger.log('rgi db opened');
    });
    // import default data
    userModel.createDefaultUsers();
    countryModel.createDefaultCountries();
    questionModel.createDefaultQuestions();
    intervieweeModel.createDefaultInterviewees();
    resourceModel.createDefaultResources();

    //Connection session
    app.use(session({
        secret: SESSION_SECRET,
        store: new MongoStore({
            mongooseConnection: db,
            autoRemove: 'native',
            touchAfter: 120}),
        touchAfter: 120,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // stylus middleware implementation - routes to anything in public directory
    app.use(stylus.middleware(
        {
            src: config.rootPath + '/public',
            compile: compile
        }
    ));
    app.use(express.static(config.rootPath + '/public'));
};