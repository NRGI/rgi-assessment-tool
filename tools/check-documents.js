'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

const filePath = require('./file-path');
const fileHandlers = require('./file-handlers');
const logger = require('./logger');

logger.initialize();

fs.readFile(filePath.getInputFilePath(), 'utf8', function (err, data) {
    if(err) {
        logger.log('read document list error');
    } else {
        var inputDocuments = JSON.parse(data);

        inputDocuments.forEach(function(document) {
            const urlComponents = url.parse(document.s3_url);

            if(path.extname(urlComponents.pathname) !== '.pdf') {
                fileHandlers.handleNotPdfDocument(document);
            } else {
                fileHandlers.handlePdfDocument(document, 's3_url', fileHandlers.getValidS3PdfDocumentHandler(document),
                    fileHandlers.getInvalidS3PdfDocumentHandler(document));
            }
        });
    }
});
