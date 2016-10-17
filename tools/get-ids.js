'use strict';

const fs = require('fs');

const filePath = require('./file-path');
const logger = require('./logger');

var fileId = 'unprocessed';

fs.readFile(filePath.getOutputFilePath(fileId), 'utf8', function (dataError, serializedData) {
    if(dataError) {
        logger.log('read document list error');
    } else {
        var idCollection = [];

        JSON.parse(serializedData).forEach(function(record) {
            idCollection.push(record._id);
        });

        fs.writeFile(filePath.getOutputFilePath(fileId + '-ids'), JSON.stringify(idCollection));
    }
});
