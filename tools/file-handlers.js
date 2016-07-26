'use strict';

const PDFParser = require("pdf2json/pdfparser");

exports.handleNotPdfDocument = function(notPdfDocument) {
    console.error(notPdfDocument.s3_url + ' is not a PDF file.');
};

exports.handlePdfDocument = function(documentUrl, validHandler, invalidHandler) {
    var pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", validHandler);
    pdfParser.on("pdfParser_dataReady", invalidHandler);
    pdfParser.loadPDF(documentUrl);
};

exports.getInvalidS3PdfDocumentHandler = function(pdfDocument) {
    return function() {
        console.error(pdfDocument.s3_url + ' HAS BEEN SUCCESSFULLY OPEN.');
    };
};

exports.getValidS3PdfDocumentHandler = function(pdfDocument) {
    return function() {
        console.error(pdfDocument.s3_url + ' cannot be open.');
    };
};
