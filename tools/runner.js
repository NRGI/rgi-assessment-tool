'use strict';

const fs = require('fs');

const documentsChecker = require('./check-documents');
const filePath = require('./file-path');
const logger = require('./logger');

fs.readFile(filePath.getInputFilePath(), 'utf8', function (dataError, serializedData) {
    if(dataError) {
        logger.log('read document list error');
    } else {
        var configFilePath = filePath.getConfigFilePath();

        fs.readFile(configFilePath, 'utf8', function (configError, serializedConfig) {
            if(configError) {
                logger.log('read document list error');
            } else {
                var config = JSON.parse(serializedConfig);
                var data = JSON.parse(serializedData);

                if(config.log.mute) {
                    logger.initialize();
                }

                var processPortion = function() {
                    if(config.processed < data.length) {
                        var portion = data.slice(config.processed, config.processed + config.portion);

                        documentsChecker.check(portion, config, function() {
                            config.processed += portion.length;
                            fs.writeFile(configFilePath, JSON.stringify(config), processPortion);

                            logger.log('Processed ' + config.processed + ' of ' + data.length + ' i.e. ' +
                                (config.processed / data.length * 100).toFixed(1) + '%');
                        });
                    }
                };

                processPortion();
                logger.log('Already processed ' + config.processed + ' of ' + data.length + ' i.e. ' +
                    (config.processed / data.length * 100).toFixed(1) + '%');
            }
        });
    }
});
