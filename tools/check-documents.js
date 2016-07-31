'use strict';

const async = require('async');
const fs = require('fs');
const path = require('path');
const url = require('url');

const fileHandlers = require('./file-handlers');
const filePath = require('./file-path');
const logger = require('./logger');

exports.check = function(inputDocuments, config, done) {
    var
        promises = [], outputDocuments = {
            'broken-source': [],
            'fix-available': [],
            'not-pdf': [],
            'source-required': [],
            'valid': [],
            'unprocessed': []
        },
        saveResults = function() {
            promises = [];

            Object.keys(outputDocuments).forEach(function(fileName) {
                promises.push(function(callback) {
                    fs.writeFile(filePath.getOutputFilePath(fileName), JSON.stringify(outputDocuments[fileName]), callback);
                });
            });

            async.parallel(promises, done);
        };

    Object.keys(outputDocuments).forEach(function(outputFileName) {
        promises.push(function(callback) {
            fs.readFile(filePath.getOutputFilePath(outputFileName), 'utf8', function (err, processedData) {
                if (!err) {
                    outputDocuments[outputFileName] = outputDocuments[outputFileName].concat(JSON.parse(processedData));
                }
                callback();
            });
        });
    });

    inputDocuments.forEach(function(document) {
        const urlComponents = url.parse(document.s3_url);

        if(config.log.detailed) {
            logger.log(document._id + ' is being processed.');
        }

        if(path.extname(urlComponents.pathname).toLowerCase() !== '.pdf') {
            outputDocuments['not-pdf'].push(document);
            logger.log(document._id + ' is marked as NOT PDF!');
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

    async.parallel(promises, saveResults);
};
