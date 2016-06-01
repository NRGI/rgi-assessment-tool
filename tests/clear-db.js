'use strict';

var mongoose = require('mongoose'),
    async = require('async');

var testEnvironment = 'test',
    config = require('../server/config/config')[testEnvironment],
    models = require('./models');

Object.keys(models).forEach(function(modelName) {
    require('../server/models/' + models[modelName]);
});

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));

db.once('open', function callback() {
    var cleanUpHandlers = [],
        getCleanUpHandler = function(modelName) {
            return function(callback) {
                mongoose.model(modelName).remove({}, function(err) {
                    if(err) {
                        console.log('Clean up of the model `' + modelName + '` is failed. The error is');
                        console.log(err);
                    } else {
                        console.log('The model `' + modelName + '` has been successfully cleaned up.');
                    }
                    callback(err);
                });
            };
        },
        closeConnection = function() {
            console.log('test db cleared');
            mongoose.connection.close();
            mongoose.disconnect();
            console.log('connection closed');
        };

    Object.keys(models).forEach(function(modelName) {
        cleanUpHandlers.push(getCleanUpHandler(modelName));
    });

    async.parallel(cleanUpHandlers, closeConnection);
});
