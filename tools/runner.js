'use strict';

const fs = require('fs');

const documentsChecker = require('./check-documents');
const filePath = require('./file-path');
const logger = require('./logger');

logger.initialize();

fs.readFile(filePath.getInputFilePath(), 'utf8', function (err, data) {
    if(err) {
        logger.log('read document list error');
    } else {
        documentsChecker.check(JSON.parse(data));
    }
});
