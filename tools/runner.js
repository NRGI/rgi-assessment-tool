'use strict';

const fs = require('fs');

const documentsChecker = require('./check-documents');
const filePath = require('./file-path');
const logger = require('./logger');

logger.initialize();

fs.readFile(filePath.getInputFilePath(), 'utf8', function (dataError, serializedData) {
    if(dataError) {
        logger.log('read document list error');
    } else {
        var recordsNumberFilePath = filePath.getRecordsNumberFilePath();

        fs.readFile(recordsNumberFilePath, 'utf8', function (recordsNumberError, serializedRecordsNumberData) {
            if(recordsNumberError) {
                logger.log('read document list error');
            } else {
                var recordsNumberData = JSON.parse(serializedRecordsNumberData);
                var data = JSON.parse(serializedData);

                var processPortion = function() {
                    if(recordsNumberData.processed < data.length) {
                        var portion = data.slice(recordsNumberData.processed,
                            recordsNumberData.processed + recordsNumberData.portion);

                        documentsChecker.check(portion, function() {
                            recordsNumberData.processed += portion.length;
                            fs.writeFile(recordsNumberFilePath, JSON.stringify(recordsNumberData), processPortion);
                        });
                    }
                };

                processPortion();
            }
        });
    }
});
