'use strict';

const async = require('async');
const fs = require('fs');
const path = require('path');
const url = require('url');

const fileHandlers = require('./file-handlers');
const filePath = require('./file-path');
const logger = require('./logger');

logger.initialize();

fs.readFile(filePath.getInputFilePath(), 'utf8', function (err, data) {
    if(err) {
        logger.log('read document list error');
    } else {
        var inputDocuments = JSON.parse(data);

        var outputDocuments = {
            'broken-source': [],
            'fix-available': [],
            'not-pdf': [],
            'source-required': [],
            'valid': [],
            'unprocessed': []
        };

        Object.keys(outputDocuments).forEach(function(outputFileName) {
            fs.readFile(filePath.getOutputFilePath(outputFileName), 'utf8', function (err, processedData) {
                if(!err) {
                    outputDocuments[outputFileName] = outputDocuments[outputFileName].concat(JSON.parse(processedData));
                }
            });
        });

        var promises = [];

        inputDocuments.forEach(function(document) {
            const urlComponents = url.parse(document.s3_url);

            if(path.extname(urlComponents.pathname) !== '.pdf') {
                outputDocuments['not-pdf'].push(document);
            } else {
                promises.push(function(callback) {
                    fileHandlers.handlePdfDocument(document, 's3_url', fileHandlers.getValidS3PdfDocumentHandler,
                        fileHandlers.getInvalidS3PdfDocumentHandler, function(outputFile, pdfDocument) {
                            outputDocuments[outputFile].push(pdfDocument);
                            callback();
                        });
                });
            }
        });

        async.parallel(promises, function() {
            Object.keys(outputDocuments).forEach(function(fileName) {
                fs.writeFile(filePath.getOutputFilePath(fileName), JSON.stringify(outputDocuments[fileName]));
            });
        });
    }
});
