'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const PDFParser = require("pdf2json/pdfparser");

const filePath = require('./file-path');

exports.handlePdfDocument = function(pdfDocument, field, getValidHandler, getInvalidHandler, callback) {
    var fileAbsolutePath = filePath.getDownloadFilePath(pdfDocument._id);
    var file = fs.createWriteStream(fileAbsolutePath);
    var documentDownloader = pdfDocument[field].indexOf('https://') > -1 ? https : http;

    documentDownloader.get(pdfDocument[field], function(response) {
        response.pipe(file);

        file.on('finish', function() {
            file.close(function() {
                var pdfParser = new PDFParser();
                pdfParser.on("pdfParser_dataReady", getValidHandler(pdfDocument, callback));

                pdfParser.on("pdfParser_dataError", function() {
                    getInvalidHandler(pdfDocument, callback)();
                });

                pdfParser.loadPDF(fileAbsolutePath);
            });
        });
    }).on('error', function() {
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
        callback('valid', pdfDocument);
    };
};

var handleInvalidS3PdfDocumentWithoutSource = function(pdfDocument, callback) {
    callback('source-required', pdfDocument);
};

var handleUnprocessedPdfDocument = function(pdfDocument, callback) {
    callback('unprocessed', pdfDocument);
};

var getValidSourcePdfDocumentHandler = function(pdfDocument, callback) {
    return function() {
        callback('fix-available', pdfDocument);
    };
};

var getInvalidSourcePdfDocumentHandler = function(pdfDocument, callback) {
    return function() {
        callback('broken-source', pdfDocument);
    };
};
