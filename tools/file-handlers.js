'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const PDFParser = require('pdf2json/pdfparser');

const filePath = require('./file-path');
const logger = require('./logger');

exports.handlePdfDocument = function(pdfDocument, field, getValidHandler, getInvalidHandler, callback) {
    var fileAbsolutePath = filePath.getDownloadFilePath(pdfDocument._id);
    var file = fs.createWriteStream(fileAbsolutePath);
    var documentDownloader = pdfDocument[field].indexOf('https://') > -1 ? https : http;

    logger.log((field === 'source' ? 'get the source ' : 'get the S3 ') + ' of ' + pdfDocument._id);

    documentDownloader.get(pdfDocument[field], function(response) {
        logger.log('download the PDF document ' + pdfDocument._id);
        response.pipe(file);

        file.on('finish', function() {
            file.close(function() {
                logger.log('parse the PDF document ' + pdfDocument._id);
                var pdfParser = new PDFParser();
                pdfParser.on('pdfParser_dataReady', getValidHandler(pdfDocument, callback));

                pdfParser.on('pdfParser_dataError', function() {
                    logger.log('parse failure of the document ' + pdfDocument._id);
                    fs.unlink(fileAbsolutePath, getInvalidHandler(pdfDocument, callback));
                });

                pdfParser.loadPDF(fileAbsolutePath);
            });
        });
    }).on('error', function() {
        logger.log('download failure of the document ' + pdfDocument._id);
        handleUnprocessedPdfDocument(pdfDocument, callback);
    });
};

exports.getInvalidS3PdfDocumentHandler = function(pdfDocument, callback) {
    return function() {
        if(pdfDocument.source) {
            exports.handlePdfDocument(pdfDocument, 'source', getValidSourcePdfDocumentHandler,
                getInvalidSourcePdfDocumentHandler, callback);
        } else {
            handleInvalidS3PdfDocumentWithoutSource(pdfDocument, callback);
        }
    };
};

exports.getValidS3PdfDocumentHandler = function(pdfDocument, callback) {
    return function() {
        fs.unlink(filePath.getDownloadFilePath(pdfDocument._id), function() {
            logger.log(pdfDocument._id + ' is marked as VALID!');
            callback('valid', pdfDocument);
        });
    };
};

var handleInvalidS3PdfDocumentWithoutSource = function(pdfDocument, callback) {
    logger.log(pdfDocument._id + ' is marked as SOURCE REQUIRED!');
    callback('source-required', pdfDocument);
};

var handleUnprocessedPdfDocument = function(pdfDocument, callback) {
    fs.unlink(filePath.getDownloadFilePath(pdfDocument._id), function() {
        logger.log(pdfDocument._id + ' is marked as UNPROCESSED!');
        callback('unprocessed', pdfDocument);
    });
};

var getValidSourcePdfDocumentHandler = function(pdfDocument, callback) {
    return function() {
        logger.log(pdfDocument._id + ' is marked as FIX-AVAILABLE!');
        callback('fix-available', pdfDocument);
    };
};

var getInvalidSourcePdfDocumentHandler = function(pdfDocument, callback) {
    return function() {
        logger.log(pdfDocument._id + ' is marked as BROKEN-SOURCE!');
        callback('broken-source', pdfDocument);
    };
};
