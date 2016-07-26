'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const PDFParser = require("pdf2json/pdfparser");

const filePath = require('./file-path');
const logger = require('./logger');

exports.handleNotPdfDocument = function(notPdfDocument) {
    logger.log(notPdfDocument._id + ' is not a PDF file.');
};

exports.handlePdfDocument = function(pdfDocument, field, validHandler, invalidHandler) {
    var fileAbsolutePath = filePath.getDownloadFilePath(pdfDocument._id);
    var file = fs.createWriteStream(fileAbsolutePath);
    var documentDownloader = pdfDocument[field].indexOf('https://') > -1 ? https : http;

    try {
        documentDownloader.get(pdfDocument[field], function(response) {
            response.pipe(file);

            file.on('finish', function() {
                file.close(function() {
                    var pdfParser = new PDFParser();
                    pdfParser.on("pdfParser_dataError", invalidHandler);
                    pdfParser.on("pdfParser_dataReady", validHandler);
                    pdfParser.loadPDF(fileAbsolutePath);
                });
            });
        });
    } catch(error) {
        handleUnprocessedPdfDocument(pdfDocument);
    }
};

exports.getInvalidS3PdfDocumentHandler = function(pdfDocument) {
    return function() {
        if(pdfDocument.source) {
            exports.handlePdfDocument(pdfDocument, 'source', getValidSourcePdfDocumentHandler(pdfDocument),
                getInvalidSourcePdfDocumentHandler(pdfDocument));
        } else {
            handleInvalidS3PdfDocumentWithoutSource(pdfDocument);
        }
    };
};

exports.getValidS3PdfDocumentHandler = function(pdfDocument) {
    return function() {
        logger.log(pdfDocument._id + ' is a properly uploaded PDF document.');
    };
};

var handleInvalidS3PdfDocumentWithoutSource = function(pdfDocument) {
    logger.log(pdfDocument._id + ' is a PDF document without source.');
};

var handleUnprocessedPdfDocument = function(pdfDocument) {
    logger.log(pdfDocument._id + ' has not been processed.');
};

var getValidSourcePdfDocumentHandler = function(document) {
    return function() {
        logger.log(document._id + ' is a broken PDF document but it can be uploaded from' + document.source + '.');
    };
};

var getInvalidSourcePdfDocumentHandler = function(document) {
    return function() {
        logger.log(document._id + ' is a broken PDF document with broken source.');
    };
};
