'use strict';

var async = require('async'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    path = require('path');

var testEnvironment = 'test',
    config = require('../../server/config/config')[testEnvironment],
    models = require('../models');

Object.keys(models).forEach(function(modelName) {
    require('../../server/models/' + models[modelName]);
});

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));

db.once('open', function callback() {
    console.log('apply fixtures');

    var cleanUpHandlers = [],
        closeConnection = function() {
            mongoose.connection.close();
            mongoose.disconnect();
            console.log('close db connection');
        },
        getFixtureHandler = function(path) {
            return function(callback) {
                require(path).load(mongoose, callback);
            };
        },
        scanFixturesDirectory = function(currentDirPath, callback) {
            fs.readdirSync(currentDirPath).forEach(function (name) {
                var filePath = path.join(currentDirPath, name);
                var stat = fs.statSync(filePath);

                if (stat.isFile()) {
                    callback(filePath, stat);
                } else if (stat.isDirectory()) {
                    scanFixturesDirectory(filePath, callback);
                }
            });
        };

    scanFixturesDirectory(path.join(__dirname, '/fixtures'), function(filePath) {
        var TARGET_EXTENSION = '.fixture.js',
            extensionPosition = filePath.indexOf(TARGET_EXTENSION);

        if((extensionPosition === (filePath.length - TARGET_EXTENSION.length)) && (extensionPosition !== -1)) {
            cleanUpHandlers.push(getFixtureHandler(filePath));
        }
    });

    async.parallel(cleanUpHandlers, closeConnection);
});
