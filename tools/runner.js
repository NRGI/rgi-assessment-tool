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

                documentsChecker.check(data, function() {
                    recordsNumberData.processed += data.length;
                    fs.writeFile(recordsNumberFilePath, JSON.stringify(recordsNumberData));
                });
            }
        });
    }
});
