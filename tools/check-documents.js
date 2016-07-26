'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

const filePath = require('./file-path');
const fileHandlers = require('./file-handlers');

fs.readFile(filePath.getInputFilePath(process.env.NODE_ENV), 'utf8', function (err, data) {
    if(err) {
        console.log('read document list error');
    } else {
        var inputDocuments = JSON.parse(data);

        inputDocuments.forEach(function(inputDocument) {
            const urlComponents = url.parse(inputDocument.s3_url);

            if(path.extname(urlComponents.pathname) !== '.pdf') {
                fileHandlers.handleNotPdfDocument(inputDocument);
            } else {
                fileHandlers.handlePdfDocument(inputDocument.s3_url, fileHandlers.getValidS3PdfDocumentHandler(inputDocument),
                    fileHandlers.getInvalidS3PdfDocumentHandler(inputDocument));
            }
        });
    }
});
