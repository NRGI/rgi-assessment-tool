'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const PDFParser = require("pdf2json/pdfparser");

var processPdfDocument = function(documentUrl, validHandler, invalidHandler) {
    var pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", validHandler);
    pdfParser.on("pdfParser_dataReady", invalidHandler);
    pdfParser.loadPDF(documentUrl);
};

var getInvalidS3PdfDocumentHandler = function(pdfDocument) {
    return function() {
        console.error(pdfDocument.s3_url + ' HAS BEEN SUCCESSFULLY OPEN.');
    };
};

var getValidS3PdfDocumentHandler = function(pdfDocument) {
    return function() {
        console.error(pdfDocument.s3_url + ' cannot be open.');
    };
};

var handleNotPdfDocument = function(notPdfDocument) {
    console.error(notPdfDocument.s3_url + ' is not a PDF file.');
};

var getInputFilePath = function(env) {
    return __dirname + '/input/' + env + '.json';
};

fs.readFile(getInputFilePath(process.env.NODE_ENV), 'utf8', function (err, data) {
    if(err) {
        console.log('read document list error');
    } else {
        var inputDocuments = JSON.parse(data);

        inputDocuments.forEach(function(inputDocument) {
            const urlComponents = url.parse(inputDocument.s3_url);

            if(path.extname(urlComponents.pathname) !== '.pdf') {
                handleNotPdfDocument(inputDocument);
            } else {
                processPdfDocument(inputDocument.s3_url, getValidS3PdfDocumentHandler(inputDocument),
                    getInvalidS3PdfDocumentHandler(inputDocument));
            }
        });
    }
});
