'use strict';

const fs = require('fs');

const filePath = require('./file-path');
const logger = require('./logger');

var fileName = filePath.getOutputFilePath('valid');

fs.readFile(fileName, 'utf8', function (dataError, serializedData) {
    if(dataError) {
        logger.log('read document list error');
    } else {
        var records = JSON.parse(serializedData);
        var uniqueRecords = [], idCollection = [];

        records.forEach(function(record) {
            if(idCollection.indexOf(record._id) === -1) {
                uniqueRecords.push(record);
                idCollection.push(record._id);
            }
        });

        fs.writeFile(fileName, JSON.stringify(uniqueRecords));
    }
});
