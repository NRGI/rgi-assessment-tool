'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

fs.readFile(__dirname + '/input/' + process.env.NODE_ENV + '.json', 'utf8', function (err, data) {
    if(err) {
        console.log('read document list error');
    } else {
        var documents = JSON.parse(data);
        var pdfDocuments = [], removeDocumentIndices = [];

        documents.forEach(function(document, documentIndex) {
            const urlComponents = url.parse(document.s3_url.replace('\'', ''));

            if(path.extname(urlComponents.pathname) === '.pdf') {
                pdfDocuments.push(document);
                removeDocumentIndices.push(documentIndex);
            }
        });

        removeDocumentIndices.reverse();

        removeDocumentIndices.forEach(function(documentIndex) {
            documents.splice(documentIndex, 1);
        });
    }
});
