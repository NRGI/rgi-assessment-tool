'use strict';

var getFileAbsolutePath = function(folderName, fileSubPath, extension) {
    return __dirname + '/' + folderName + '/' + fileSubPath + '.' + (extension || 'json');
};

exports.getDownloadFilePath = function(fileName) {
    return getFileAbsolutePath('downloads', process.env.NODE_ENV + '/' + fileName, 'pdf');
};

exports.getInputFilePath = function() {
    return getFileAbsolutePath('input', process.env.NODE_ENV);
};

exports.getOutputFilePath = function(fileName) {
    return getFileAbsolutePath('output', process.env.NODE_ENV + '/' + fileName);
};

exports.getRecordsNumberFilePath = function() {
    return getFileAbsolutePath('records-number', process.env.NODE_ENV);
};
